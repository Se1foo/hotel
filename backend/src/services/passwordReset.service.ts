import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { HttpError } from '../utils/httpError';

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour
const BCRYPT_ROUNDS = 12;

/**
 * Password reset.
 *
 * The login page shipped a `<a href="#">Forgot password?</a>` with no flow
 * behind it at all. This implements one properly:
 *
 * - The raw token goes only to the user's inbox; the database stores a SHA-256
 *   hash of it. A leaked database dump therefore can't be used to reset accounts.
 * - Tokens are single-use and expire after an hour.
 * - Completing a reset revokes every existing refresh token, so an attacker who
 *   already had a session is logged out.
 */

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export interface ResetRequestResult {
  /** Undefined when no eligible account exists — the caller must not reveal this. */
  token?: string;
  email?: string;
}

export async function requestPasswordReset(email: string): Promise<ResetRequestResult> {
  const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).exec();

  // Callers always respond with the same success message regardless, so this
  // endpoint can't be used to enumerate registered addresses.
  if (!user) return {};

  // Google-only accounts have no password to reset.
  if (!user.passwordHash) return {};

  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetTokenHash = hashToken(token);
  user.passwordResetExpires = new Date(Date.now() + RESET_TTL_MS);
  await user.save();

  return { token, email: user.email };
}

export async function completePasswordReset(token: string, newPassword: string): Promise<void> {
  const user = await UserModel.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).exec();

  if (!user) {
    throw HttpError.badRequest('This reset link is invalid or has expired');
  }

  user.passwordHash = await bcryptjs.hash(newPassword, BCRYPT_ROUNDS);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;

  // A password reset is the standard remedy for a compromised account, so every
  // other active session must die with it.
  user.refreshTokens = [];

  // Resetting via an emailed link also proves control of the address.
  user.isVerified = true;

  await user.save();
}
