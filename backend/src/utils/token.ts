import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  id: string;
  email: string;
}

// Lifetimes are configurable rather than hardcoded at the call site.
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtl,
  } as SignOptions);
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTtl,
  } as SignOptions);
}

/**
 * `jwt.verify` returns `string | JwtPayload`; the previous version cast straight
 * to `TokenPayload`, so a malformed token could produce a `req.user` with
 * `undefined` fields that then flowed into database queries.
 */
export function verifyAccessToken(token: string): TokenPayload {
  return normalize(jwt.verify(token, env.jwtAccessSecret));
}

export function verifyRefreshToken(token: string): TokenPayload {
  return normalize(jwt.verify(token, env.jwtRefreshSecret));
}

function normalize(decoded: unknown): TokenPayload {
  if (typeof decoded !== 'object' || decoded === null) {
    throw new Error('Malformed token payload');
  }
  const { id, email } = decoded as Record<string, unknown>;
  if (typeof id !== 'string' || typeof email !== 'string') {
    throw new Error('Malformed token payload');
  }
  return { id, email };
}
