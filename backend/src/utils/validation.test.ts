import { describe, expect, it } from 'vitest';
import {
  ContactMessageSchema,
  CreateTripSchema,
  LoginSchema,
  RegisterSchema,
  ReviewSchema,
  passwordSchema,
} from './validation';

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

describe('passwordSchema', () => {
  it('accepts a password meeting every rule', () => {
    expect(passwordSchema.safeParse('Str0ng!Pass').success).toBe(true);
  });

  it.each([
    ['too short', 'Ab1!c'],
    ['no uppercase', 'str0ng!pass'],
    ['no lowercase', 'STR0NG!PASS'],
    ['no digit', 'Strong!Pass'],
    ['no symbol', 'Str0ngPass1'],
  ])('rejects a password with %s', (_label, value) => {
    expect(passwordSchema.safeParse(value).success).toBe(false);
  });

  it('rejects an absurdly long password rather than hashing it', () => {
    // bcrypt silently truncates past 72 bytes; an explicit cap avoids the
    // surprise of two different long passwords both being accepted.
    expect(passwordSchema.safeParse('A1!a'.repeat(100)).success).toBe(false);
  });
});

describe('RegisterSchema', () => {
  it('normalises the email to lowercase and trims it', () => {
    const parsed = RegisterSchema.parse({
      name: '  Jordan Rivera  ',
      email: '  Jordan@Example.COM ',
      password: 'Str0ng!Pass',
    });
    expect(parsed.email).toBe('jordan@example.com');
    expect(parsed.name).toBe('Jordan Rivera');
  });

  it('rejects a single-character name', () => {
    expect(
      RegisterSchema.safeParse({ name: 'J', email: 'a@b.co', password: 'Str0ng!Pass' }).success,
    ).toBe(false);
  });
});

describe('LoginSchema', () => {
  it('does not impose password complexity on sign-in', () => {
    // Complexity rules changed over time; existing users must still be able to
    // submit whatever their password actually is.
    expect(LoginSchema.safeParse({ email: 'a@b.co', password: 'x' }).success).toBe(true);
  });

  it('still requires a non-empty password', () => {
    expect(LoginSchema.safeParse({ email: 'a@b.co', password: '' }).success).toBe(false);
  });
});

describe('CreateTripSchema', () => {
  const valid = {
    destinationId: 1,
    checkIn: daysFromNow(10),
    checkOut: daysFromNow(14),
    guests: 2,
  };

  it('accepts a well-formed booking', () => {
    expect(CreateTripSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a check-out on or before check-in', () => {
    expect(
      CreateTripSchema.safeParse({ ...valid, checkOut: valid.checkIn }).success,
    ).toBe(false);
    expect(
      CreateTripSchema.safeParse({ ...valid, checkIn: daysFromNow(14), checkOut: daysFromNow(10) })
        .success,
    ).toBe(false);
  });

  it('rejects a check-in in the past', () => {
    expect(
      CreateTripSchema.safeParse({ ...valid, checkIn: daysFromNow(-1), checkOut: daysFromNow(3) })
        .success,
    ).toBe(false);
  });

  it('allows a check-in earlier today', () => {
    const earlierToday = new Date();
    earlierToday.setHours(0, 30, 0, 0);
    expect(
      CreateTripSchema.safeParse({
        ...valid,
        checkIn: earlierToday.toISOString(),
        checkOut: daysFromNow(2),
      }).success,
    ).toBe(true);
  });

  it('caps the stay length', () => {
    expect(
      CreateTripSchema.safeParse({ ...valid, checkOut: daysFromNow(200) }).success,
    ).toBe(false);
  });

  it('rejects a non-positive guest count', () => {
    expect(CreateTripSchema.safeParse({ ...valid, guests: 0 }).success).toBe(false);
    expect(CreateTripSchema.safeParse({ ...valid, guests: -2 }).success).toBe(false);
  });

  it('ignores client-supplied price, title and status fields', () => {
    // The old schema accepted `tripId` and `status` from the body, letting a
    // caller self-assign a reference and mark its own booking Confirmed.
    const parsed = CreateTripSchema.parse({
      ...valid,
      tripId: 'TRP-FORGED',
      status: 'Confirmed',
      totalPrice: 1,
      title: 'Free Penthouse',
    });
    expect(parsed).not.toHaveProperty('tripId');
    expect(parsed).not.toHaveProperty('status');
    expect(parsed).not.toHaveProperty('totalPrice');
    expect(parsed).not.toHaveProperty('title');
  });
});

describe('ReviewSchema', () => {
  it('accepts a rating with no comment', () => {
    expect(ReviewSchema.safeParse({ rating: 4 }).success).toBe(true);
  });

  it('rejects out-of-range and fractional ratings', () => {
    expect(ReviewSchema.safeParse({ rating: 0 }).success).toBe(false);
    expect(ReviewSchema.safeParse({ rating: 6 }).success).toBe(false);
    expect(ReviewSchema.safeParse({ rating: 4.5 }).success).toBe(false);
  });

  it('rejects an over-long comment', () => {
    expect(ReviewSchema.safeParse({ rating: 5, comment: 'x'.repeat(1501) }).success).toBe(false);
  });
});

describe('ContactMessageSchema', () => {
  it('requires enough detail to be actionable', () => {
    expect(
      ContactMessageSchema.safeParse({ name: 'Jo', email: 'a@b.co', message: 'hi' }).success,
    ).toBe(false);
    expect(
      ContactMessageSchema.safeParse({
        name: 'Jo',
        email: 'a@b.co',
        message: 'I have a question about the Bali villa.',
      }).success,
    ).toBe(true);
  });
});
