import rateLimit, { type Options } from 'express-rate-limit';

const base = {
  standardHeaders: true as const,
  legacyHeaders: false as const,
};

const minutes = (n: number) => n * 60 * 1000;

/**
 * The original setup applied one 100-per-15-minutes limiter to all of
 * `/api/auth`, including `/refresh` and `/me` — both of which fire on every page
 * load. Ordinary browsing could exhaust the budget and lock a user out of their
 * own session, while brute-forcing `/login` got the same generous allowance as
 * reading a profile.
 *
 * Each limiter below is a **separate instance with its own counter**. That
 * matters: a single shared instance means failed sign-up attempts also consume
 * the password-reset budget, so a user who fumbles registration can't then
 * recover their account. Keeping them independent contains the blast radius of
 * any one flow.
 */
const strict = (limit: number, windowMinutes: number, message: string): Partial<Options> => ({
  ...base,
  windowMs: minutes(windowMinutes),
  limit,
  // Only failures count against the budget, so a legitimate user isn't
  // penalised for signing in repeatedly from a shared IP.
  skipSuccessfulRequests: true,
  message: { error: message },
});

/** Brute-force defence on password submission. */
export const loginLimiter = rateLimit(
  strict(10, 15, 'Too many sign-in attempts. Please try again in 15 minutes.'),
);

/** Slows down automated account creation. */
export const registerLimiter = rateLimit(
  strict(5, 60, 'Too many accounts created from this address. Please try again later.'),
);

/** Independent budget so a locked-out user can still recover their account. */
export const passwordResetLimiter = rateLimit(
  strict(5, 60, 'Too many password reset attempts. Please try again later.'),
);

/**
 * Verification links get a looser budget: clicking one twice, refreshing the
 * page, or React StrictMode's double-invoked effect should never burn through it.
 */
export const verifyEmailLimiter = rateLimit(
  strict(20, 15, 'Too many verification attempts. Please try again shortly.'),
);

/** Session upkeep, called on every page load. */
export const sessionLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 300,
  message: { error: 'Too many requests. Please slow down.' },
});

/** An unauthenticated write that generates outbound mail. */
export const contactLimiter = rateLimit({
  ...base,
  windowMs: minutes(60),
  limit: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
});

/** Broad backstop for the rest of the API. */
export const apiLimiter = rateLimit({
  ...base,
  windowMs: minutes(15),
  limit: 600,
  message: { error: 'Too many requests. Please slow down.' },
});
