import crypto from 'crypto';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { UserModel, type IUser } from '../models/user.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { HttpError } from '../utils/httpError';
import { env } from '../config/env';

/** Keeps the stored token list from growing without bound across many devices. */
const MAX_ACTIVE_SESSIONS = 5;

/**
 * How long a just-rotated refresh token remains answerable, so concurrent
 * refreshes from multiple tabs don't destroy the session. Short enough that a
 * stolen token is near-useless.
 */
const ROTATION_GRACE_MS = 30_000;

const BCRYPT_ROUNDS = 12;

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

function issueTokens(user: IUser): SessionTokens {
  return {
    accessToken: generateAccessToken({ id: user.id, email: user.email }),
    refreshToken: generateRefreshToken({ id: user.id, email: user.email }),
  };
}

/**
 * Records a refresh token against the user, trimming the oldest sessions.
 * The previous implementation pushed to `refreshTokens` on every login and
 * never removed anything, so the array grew for the lifetime of the account.
 */
async function rememberSession(user: IUser, refreshToken: string): Promise<void> {
  user.refreshTokens = [...user.refreshTokens, refreshToken].slice(-MAX_ACTIVE_SESSIONS);
  await user.save();
}

export async function registerUser(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await UserModel.findOne({ email: normalizedEmail }).exec();
  if (existing) {
    throw HttpError.conflict('An account with that email already exists');
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await UserModel.create({
    name,
    email: normalizedEmail,
    passwordHash: await bcryptjs.hash(password, BCRYPT_ROUNDS),
    isVerified: false,
    authProvider: 'local',
    verificationToken,
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return { user, verificationToken };
}

export async function loginUser(email: string, password: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).exec();

  // Uniform message for both branches so the endpoint can't be used to
  // enumerate which addresses have accounts.
  const invalid = HttpError.unauthorized('Invalid email or password');

  if (!user) {
    // Equalise timing against the bcrypt comparison on the happy path.
    await bcryptjs.compare(password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva');
    throw invalid;
  }

  if (!user.passwordHash) {
    throw HttpError.unauthorized(
      'This account uses Google sign-in. Please continue with Google.',
    );
  }

  if (!(await bcryptjs.compare(password, user.passwordHash))) {
    throw invalid;
  }

  if (!user.isVerified) {
    throw HttpError.forbidden('Please verify your email address before signing in');
  }

  const tokens = issueTokens(user);
  await rememberSession(user, tokens.refreshToken);
  return { user, tokens };
}

/**
 * Rotates the refresh token: the presented token is invalidated and a fresh one
 * issued. Previously `/refresh` returned a new access token while leaving the
 * refresh token valid for its full 7 days, so a captured token stayed usable
 * even after the legitimate user signed out on that device.
 *
 * Rotation alone, however, breaks on benign races. Two tabs restoring a session
 * on load — or React StrictMode's double-invoked effect, or a retried request —
 * both present the same valid token; the first rotates it and the second gets a
 * 401, which logged the user straight back out. So a rotated token stays
 * answerable for `ROTATION_GRACE_MS`, during which the loser of the race is
 * handed the token that replaced it instead of an error.
 *
 * Presenting a rotated token after the grace window is treated as theft and
 * revokes every session, per the OAuth 2.0 security BCP.
 */
export async function rotateSession(presentedToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(presentedToken);
  } catch {
    throw HttpError.unauthorized('Invalid or expired refresh token');
  }

  /**
   * Retried on a version conflict.
   *
   * Rotation is a read-modify-write, so two concurrent refreshes both read the
   * same document version and the loser's `save()` throws Mongoose's
   * `VersionError` — surfacing as a 500. Re-reading is exactly the right
   * response: on the second pass the presented token has been moved into
   * `rotatedTokens` by the winner, so the grace branch returns the replacement
   * and the request succeeds.
   */
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await attemptRotation(payload.id, presentedToken);
    } catch (error) {
      const isVersionConflict =
        error instanceof mongoose.Error.VersionError ||
        (error as { name?: string }).name === 'VersionError';

      if (!isVersionConflict || attempt >= 3) throw error;
    }
  }
}

async function attemptRotation(userId: string, presentedToken: string) {
  const user = await UserModel.findById(userId).exec();
  if (!user) throw HttpError.unauthorized('This session is no longer valid');

  const now = Date.now();

  // Drop grace records that have aged out before inspecting them.
  user.rotatedTokens = (user.rotatedTokens ?? []).filter(
    (entry) => now - entry.rotatedAt.getTime() < ROTATION_GRACE_MS,
  );

  if (!user.refreshTokens.includes(presentedToken)) {
    const graced = user.rotatedTokens.find((entry) => entry.token === presentedToken);

    // Inside the grace window: answer with the replacement rather than a 401.
    if (graced && user.refreshTokens.includes(graced.replacedBy)) {
      await user.save();
      return {
        user,
        tokens: {
          accessToken: generateAccessToken({ id: user.id, email: user.email }),
          refreshToken: graced.replacedBy,
        },
      };
    }

    /**
     * A signature-valid token that is neither active nor within its grace
     * window means it was captured and replayed. Revoke everything.
     */
    user.refreshTokens = [];
    user.rotatedTokens = [];
    await user.save();
    throw HttpError.unauthorized('This session is no longer valid');
  }

  const tokens = issueTokens(user);

  user.refreshTokens = [
    ...user.refreshTokens.filter((token) => token !== presentedToken),
    tokens.refreshToken,
  ].slice(-MAX_ACTIVE_SESSIONS);

  user.rotatedTokens = [
    ...user.rotatedTokens,
    { token: presentedToken, replacedBy: tokens.refreshToken, rotatedAt: new Date() },
  ].slice(-MAX_ACTIVE_SESSIONS * 2);

  await user.save();

  return { user, tokens };
}

export async function revokeSession(presentedToken: string): Promise<void> {
  try {
    const payload = verifyRefreshToken(presentedToken);
    await UserModel.updateOne(
      { _id: payload.id },
      { $pull: { refreshTokens: presentedToken } },
    ).exec();
  } catch {
    // An expired or forged token needs no revocation; logout still succeeds.
  }
}

export async function verifyEmailToken(token: string) {
  const user = await UserModel.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() },
  }).exec();

  if (!user) throw HttpError.badRequest('Invalid or expired verification token');

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return user;
}

const googleClient = new OAuth2Client(env.googleClientId);

interface GoogleProfile {
  email: string;
  name: string;
  googleId: string;
}

async function fetchGoogleProfile(accessToken: string): Promise<GoogleProfile> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw HttpError.unauthorized('Could not verify your Google account');
  }

  const profile = (await response.json()) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
    sub?: string;
  };

  if (!profile.email || !profile.sub) {
    throw HttpError.unauthorized('Google did not return an email address');
  }

  // The old handler skipped this check entirely. Without it, a Google account
  // holding an unverified address could be used to claim a local account
  // registered with that same address.
  if (profile.email_verified === false) {
    throw HttpError.forbidden('Your Google email address is not verified');
  }

  return {
    email: profile.email.toLowerCase().trim(),
    name: profile.name?.trim() || 'Guest',
    googleId: profile.sub,
  };
}

export async function loginWithGoogle(accessToken: string) {
  const profile = await fetchGoogleProfile(accessToken);

  let user = await UserModel.findOne({ email: profile.email }).exec();

  if (!user) {
    user = await UserModel.create({
      name: profile.name,
      email: profile.email,
      isVerified: true, // Verified by Google, checked above.
      authProvider: 'google',
      googleId: profile.googleId,
    });
  } else if (!user.googleId) {
    /**
     * Links Google to an existing local account rather than converting it.
     * The previous code overwrote `authProvider` to 'google', which stranded
     * the user's password: they could no longer sign in with it, and the login
     * handler would tell them to "use Google Login" forever.
     */
    user.googleId = profile.googleId;
    user.isVerified = true;
    await user.save();
  }

  const tokens = issueTokens(user);
  await rememberSession(user, tokens.refreshToken);
  return { user, tokens };
}

/** Exported for tests / future ID-token support. */
export { googleClient };
