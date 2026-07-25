import { describe, expect, it } from 'vitest';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './token';

// Secrets are provided by `src/test/setup.ts`, which runs before this module is
// imported — `config/env.ts` validates (and can exit) at import time.

describe('token issuing and verification', () => {
  it('round-trips an access token payload', () => {
    const token = generateAccessToken({ id: 'abc123', email: 'a@b.co' });
    expect(verifyAccessToken(token)).toEqual({ id: 'abc123', email: 'a@b.co' });
  });

  it('round-trips a refresh token payload', () => {
    const token = generateRefreshToken({ id: 'abc123', email: 'a@b.co' });
    expect(verifyRefreshToken(token)).toEqual({ id: 'abc123', email: 'a@b.co' });
  });

  it('will not verify an access token with the refresh secret, or vice versa', () => {
    // Separate secrets are what stop a long-lived refresh token being replayed
    // as a bearer access token.
    expect(() => verifyRefreshToken(generateAccessToken({ id: 'a', email: 'a@b.co' }))).toThrow();
    expect(() => verifyAccessToken(generateRefreshToken({ id: 'a', email: 'a@b.co' }))).toThrow();
  });

  it('rejects a tampered token', () => {
    const token = generateAccessToken({ id: 'abc123', email: 'a@b.co' });
    expect(() => verifyAccessToken(`${token.slice(0, -3)}xyz`)).toThrow();
  });

  it('rejects garbage', () => {
    expect(() => verifyAccessToken('not.a.token')).toThrow();
    expect(() => verifyAccessToken('')).toThrow();
  });

  it('strips extra claims down to the known payload shape', () => {
    const token = generateAccessToken({
      id: 'abc123',
      email: 'a@b.co',
      // A caller passing extra fields must not smuggle them into `req.user`.
      role: 'admin',
    } as never);
    expect(verifyAccessToken(token)).toEqual({ id: 'abc123', email: 'a@b.co' });
  });
});
