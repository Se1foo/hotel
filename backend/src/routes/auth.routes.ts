import { Router } from 'express';
import {
  forgotPassword,
  getProfile,
  googleLogin,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import {
  loginLimiter,
  passwordResetLimiter,
  registerLimiter,
  sessionLimiter,
  verifyEmailLimiter,
} from '../middlewares/rateLimiter.middleware';

const authRouter = Router();

/**
 * Each flow carries its own limiter instance, so exhausting one can't lock a
 * user out of another — a failed sign-up must not block password recovery.
 */
authRouter.post('/register', registerLimiter, register);
authRouter.post('/login', loginLimiter, login);
authRouter.post('/google', loginLimiter, googleLogin);
authRouter.post('/verify-email', verifyEmailLimiter, verifyEmail);

// Password reset — the login page previously shipped a dead `href="#"` link.
authRouter.post('/forgot-password', passwordResetLimiter, forgotPassword);
authRouter.post('/reset-password', passwordResetLimiter, resetPassword);

// Session upkeep fires on every page load, so it gets the generous limiter.
authRouter.post('/refresh', sessionLimiter, refresh);
authRouter.post('/logout', sessionLimiter, logout);

// The `verifyToken as any` cast is gone — the middleware is now a real
// `RequestHandler`.
authRouter.get('/me', sessionLimiter, verifyToken, getProfile);

export default authRouter;
