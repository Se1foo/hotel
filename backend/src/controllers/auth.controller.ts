import type { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { UserModel } from '../models/user.model';
import { RegisterSchema, LoginSchema } from '../utils/auth.validation';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { env } from '../config/env';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware';
import crypto from 'crypto';

const COOKIE_NAME = 'refreshToken';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues[0].message });
      return;
    }

    const { name, email, password } = parseResult.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already in use' });
      return;
    }

    const passwordHash = await bcryptjs.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = new UserModel({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      savedDeals: [],
      refreshTokens: [],
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    // MOCK EMAIL SENDING
    console.log(`\n\n=== VERIFICATION EMAIL ===\nTo verify ${email}, visit: ${env.frontendUrl}/verify-email?token=${verificationToken}\n==========================\n\n`);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed due to server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.issues[0].message });
      return;
    }

    const { email, password } = parseResult.data;

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ error: 'Please verify your email address before logging in' });
      return;
    }

    if (!user.passwordHash) {
      res.status(401).json({ error: 'This account was created with Google. Please use Google Login.' });
      return;
    }

    const isMatch = await bcryptjs.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());
    res.status(200).json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed due to server error' });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token missing' });
      return;
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    const user = await UserModel.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res.status(401).json({ error: 'Invalid token session' });
      return;
    }

    // Generate new Access Token
    const accessToken = generateAccessToken({ id: user.id, email: user.email });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: 'Refresh failed due to server error' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await UserModel.findById(decoded.id);
        if (user) {
          user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
          await user.save();
        }
      } catch (err) {
        // Suppress errors during logout token removal
      }
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed due to server error' });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthenticated' });
      return;
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Profile retrieval failed due to server error' });
  }
}

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id');

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    const user = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired verification token' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Email verification failed due to server error' });
  }
}

export async function googleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ error: 'Google credential missing' });
      return;
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id',
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token payload' });
      return;
    }

    const email = payload.email.toLowerCase().trim();
    const name = payload.name || 'Google User';

    let user = await UserModel.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = new UserModel({
        name,
        email,
        isVerified: true, // Trusted from Google
        authProvider: 'google',
        googleId: payload.sub,
        savedDeals: [],
        refreshTokens: [],
      });
    } else {
      // If user exists but used local auth, we might want to link it
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        user.googleId = payload.sub;
        user.isVerified = true; // Google verified it
      }
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());
    res.status(200).json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
}
