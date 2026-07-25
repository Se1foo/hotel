import type { CookieOptions, NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import {
  CompletePasswordResetSchema,
  GoogleLoginSchema,
  LoginSchema,
  RegisterSchema,
  RequestPasswordResetSchema,
  VerifyEmailSchema,
} from '../utils/validation';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware';
import {
  loginUser,
  loginWithGoogle as loginWithGoogleService,
  registerUser,
  revokeSession,
  rotateSession,
  verifyEmailToken,
} from '../services/auth.service';
import {
  completePasswordReset,
  requestPasswordReset,
} from '../services/passwordReset.service';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/mailer.service';

const COOKIE_NAME = 'refreshToken';

const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.isProduction,
  /**
   * `strict` blocks the cookie on any cross-site navigation — including the
   * return leg of the Google OAuth flow, and any deployment where the API and
   * the frontend sit on different hosts. `lax` still defends against CSRF on
   * state-changing POSTs while allowing top-level navigation.
   */
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

/** Same attributes minus `maxAge`, as the browser requires to match on clear. */
const clearCookieOptions = (): CookieOptions => {
  const { maxAge: _maxAge, ...rest } = cookieOptions();
  return rest;
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, password } = RegisterSchema.parse(req.body);
    const { verificationToken } = await registerUser(name, email, password);

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'Registration successful. Check your email to verify your account.',
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const { user, tokens } = await loginUser(email, password);

    res.cookie(COOKIE_NAME, tokens.refreshToken, cookieOptions());
    res.status(200).json({ accessToken: tokens.accessToken, user: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const presented = req.cookies?.[COOKIE_NAME];
    if (!presented) throw HttpError.unauthorized('Refresh token missing');

    const { tokens } = await rotateSession(presented);

    // Rotation issues a new refresh token, so the cookie is replaced too.
    res.cookie(COOKIE_NAME, tokens.refreshToken, cookieOptions());
    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const presented = req.cookies?.[COOKIE_NAME];
    if (presented) await revokeSession(presented);

    res.clearCookie(COOKIE_NAME, clearCookieOptions());
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw HttpError.unauthorized();

    const user = await UserModel.findById(req.user.id).exec();
    if (!user) throw HttpError.notFound('User not found');

    res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { token } = VerifyEmailSchema.parse(req.body);
    await verifyEmailToken(token);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = RequestPasswordResetSchema.parse(req.body);
    const result = await requestPasswordReset(email);

    if (result.token && result.email) {
      await sendPasswordResetEmail(result.email, result.token);
    }

    /**
     * Always the same response, whether or not an account exists. Returning
     * "no such user" here would turn the endpoint into an account-enumeration
     * oracle.
     */
    res.status(200).json({
      message: 'If an account exists for that address, a reset link is on its way.',
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { token, password } = CompletePasswordResetSchema.parse(req.body);
    await completePasswordReset(token, password);

    // Every session was revoked, so clear this browser's cookie too.
    res.clearCookie(COOKIE_NAME, clearCookieOptions());
    res.status(200).json({ message: 'Password updated. You can now sign in.' });
  } catch (error) {
    next(error);
  }
}

export async function googleLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!env.googleClientId) {
      throw new HttpError(503, 'Google sign-in is not configured on this server');
    }

    const { access_token: accessToken } = GoogleLoginSchema.parse(req.body);
    const { user, tokens } = await loginWithGoogleService(accessToken);

    res.cookie(COOKIE_NAME, tokens.refreshToken, cookieOptions());
    res.status(200).json({ accessToken: tokens.accessToken, user: user.toJSON() });
  } catch (error) {
    /**
     * Forwarded to the shared error handler. The previous implementation caught
     * everything here and responded with `{ error, details, stack }` — leaking
     * the server's stack trace and internal file paths to any client that could
     * make the handler throw.
     */
    next(error);
  }
}
