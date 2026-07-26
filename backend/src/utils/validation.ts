import { z } from 'zod';

/**
 * Shared request schemas. Password rules are declared once here and reused by
 * registration and password reset, so the two can never drift apart.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be at most 128 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Order matters. Zod applies these in sequence, so `.email()` must come *after*
 * `.trim()` — validating first meant a pasted or mobile-autocompleted address
 * with a trailing space was rejected as "Invalid email address".
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(255)
  .trim()
  .toLowerCase()
  .pipe(z.string().email('Invalid email address'));

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(120),
  email: emailSchema,
  password: passwordSchema,
});

export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const RequestPasswordResetSchema = z.object({
  email: emailSchema,
});

export const CompletePasswordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const GoogleLoginSchema = z.object({
  access_token: z.string().min(1, 'Google access token is required'),
});

/** Rating is required; the written review is optional. */
export const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1500).optional(),
});

export const CreateTripSchema = z
  .object({
    destinationId: z.number().int().positive(),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: z.number().int().min(1).max(20),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  })
  .refine(
    (data) => {
      // Allow today, reject anything genuinely in the past.
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return data.checkIn >= startOfToday;
    },
    { message: 'Check-in cannot be in the past', path: ['checkIn'] },
  )
  .refine(
    (data) => {
      const maxNights = 90;
      const nights = (data.checkOut.getTime() - data.checkIn.getTime()) / 86_400_000;
      return nights <= maxNights;
    },
    { message: 'Stays are limited to 90 nights', path: ['checkOut'] },
  );

export type CreateTripInput = z.infer<typeof CreateTripSchema>;

export const ContactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name').max(120),
  email: emailSchema,
  message: z
    .string()
    .trim()
    .min(10, 'Please include a little more detail')
    .max(2000, 'Please keep your message under 2000 characters'),
});

export const DestinationIdParam = z.coerce.number().int().positive();
