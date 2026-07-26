import { describe, expect, it } from 'vitest';
import {
  countNights,
  formatDate,
  formatPrice,
  fromDateInputValue,
  parseCapacity,
  pluralize,
  toDateInputValue,
} from './format';

describe('formatPrice', () => {
  it('formats whole dollars with separators and no cents', () => {
    expect(formatPrice(1250)).toBe('$1,250');
    expect(formatPrice(0)).toBe('$0');
  });

  it('rounds rather than truncating fractional amounts', () => {
    expect(formatPrice(1250.6)).toBe('$1,251');
  });
});

describe('formatDate', () => {
  it('formats an ISO timestamp as a readable date', () => {
    // The old UI rendered this raw as "2026-09-10T00:00:00.000Z".
    expect(formatDate('2026-09-10T00:00:00.000Z')).toMatch(/Sep \d{1,2}, 2026/);
  });

  it('passes through an already human-readable string instead of showing Invalid Date', () => {
    // Trips seeded before dates were normalised store values like this.
    expect(formatDate('Oct 12, 2026')).toMatch(/Oct 1[12], 2026/);
    expect(formatDate('not a date at all')).toBe('not a date at all');
  });

  it('renders an em dash for missing values', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
    expect(formatDate('')).toBe('—');
  });
});

describe('countNights', () => {
  it('counts the nights between two dates', () => {
    expect(countNights('2026-09-10', '2026-09-14')).toBe(4);
  });

  it('returns 0 for the same day', () => {
    expect(countNights('2026-09-10', '2026-09-10')).toBe(0);
  });

  it('never returns a negative count for an inverted range', () => {
    expect(countNights('2026-09-14', '2026-09-10')).toBe(0);
  });

  it('is unaffected by a daylight-saving transition', () => {
    // US DST ends 1 Nov 2026; a naive hours-based diff would yield 7.04 -> 7,
    // but an off-by-one here would mis-bill the guest.
    expect(countNights('2026-10-29', '2026-11-05')).toBe(7);
  });

  it('returns 0 when a date is unparseable', () => {
    expect(countNights('nonsense', '2026-09-14')).toBe(0);
  });
});

describe('date input round-tripping', () => {
  it('formats a Date as yyyy-MM-dd in local time', () => {
    expect(toDateInputValue(new Date(2026, 8, 5))).toBe('2026-09-05');
  });

  it('does not shift the day for a late-evening local time', () => {
    // `toISOString()` would report the next day here for any timezone east of UTC.
    expect(toDateInputValue(new Date(2026, 8, 5, 23, 30))).toBe('2026-09-05');
  });

  it('parses yyyy-MM-dd as a local date', () => {
    const parsed = fromDateInputValue('2026-09-05');
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(8);
    // `new Date('2026-09-05')` is UTC midnight, which is 4 Sep in the Americas.
    expect(parsed?.getDate()).toBe(5);
  });

  it('round-trips without drift', () => {
    const original = new Date(2026, 1, 29 - 1); // 28 Feb 2026
    expect(toDateInputValue(fromDateInputValue(toDateInputValue(original))!)).toBe(
      toDateInputValue(original),
    );
  });

  it('rejects malformed input', () => {
    expect(fromDateInputValue('')).toBeNull();
    expect(fromDateInputValue('2026-9-5')).toBeNull();
    expect(fromDateInputValue('05/09/2026')).toBeNull();
  });
});

describe('parseCapacity', () => {
  it('extracts the number from the catalogue capacity strings', () => {
    expect(parseCapacity('Up to 4')).toBe(4);
    expect(parseCapacity('Up to 2')).toBe(2);
    expect(parseCapacity('12')).toBe(12);
  });

  it('returns 0 when there is no number to find', () => {
    expect(parseCapacity('Unlimited')).toBe(0);
  });
});

describe('pluralize', () => {
  it('uses the singular for exactly one', () => {
    expect(pluralize(1, 'night')).toBe('1 night');
  });

  it('uses the plural for zero and many', () => {
    expect(pluralize(0, 'night')).toBe('0 nights');
    expect(pluralize(3, 'night')).toBe('3 nights');
  });

  it('accepts an irregular plural', () => {
    expect(pluralize(2, 'stay', 'stays')).toBe('2 stays');
  });
});
