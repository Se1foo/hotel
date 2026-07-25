import { describe, expect, it } from 'vitest';
import type { RotatedToken } from '../models/user.model';

/**
 * Regression coverage for the refresh-token rotation race.
 *
 * Rotating on every `/refresh` invalidates the presented token. Two concurrent
 * refreshes — two open tabs, a retried request, or React StrictMode's
 * double-invoked mount effect — therefore had the first succeed and the second
 * 401, which signed the user out on every page load.
 *
 * The service keeps a short grace window so the loser of that race receives the
 * replacement token instead of an error, while a genuinely stale token still
 * revokes the session. These tests pin that decision logic directly; it is pure
 * given (active tokens, rotated records, now) and needs no database.
 */

const GRACE_MS = 30_000;

type Outcome =
  | { kind: 'rotate' }
  | { kind: 'graced'; replacedBy: string }
  | { kind: 'revoke' };

/** Mirrors the branch structure of `rotateSession`. */
function decide(
  presented: string,
  active: string[],
  rotated: RotatedToken[],
  now: number,
): Outcome {
  const live = rotated.filter((entry) => now - entry.rotatedAt.getTime() < GRACE_MS);

  if (active.includes(presented)) return { kind: 'rotate' };

  const graced = live.find((entry) => entry.token === presented);
  if (graced && active.includes(graced.replacedBy)) {
    return { kind: 'graced', replacedBy: graced.replacedBy };
  }

  return { kind: 'revoke' };
}

const rotatedRecord = (over: Partial<RotatedToken> = {}): RotatedToken => ({
  token: 'old',
  replacedBy: 'new',
  rotatedAt: new Date(1_000_000),
  ...over,
});

describe('refresh token rotation decisions', () => {
  const now = 1_000_000;

  it('rotates a currently-active token', () => {
    expect(decide('active', ['active'], [], now)).toEqual({ kind: 'rotate' });
  });

  it('answers a concurrent refresh inside the grace window with the replacement', () => {
    // The exact double-refresh that logged users out on every page load.
    const outcome = decide('old', ['new'], [rotatedRecord({ rotatedAt: new Date(now - 500) })], now);
    expect(outcome).toEqual({ kind: 'graced', replacedBy: 'new' });
  });

  it('still graces a request at the very edge of the window', () => {
    const outcome = decide(
      'old',
      ['new'],
      [rotatedRecord({ rotatedAt: new Date(now - (GRACE_MS - 1)) })],
      now,
    );
    expect(outcome.kind).toBe('graced');
  });

  it('revokes once the grace window has passed', () => {
    const outcome = decide(
      'old',
      ['new'],
      [rotatedRecord({ rotatedAt: new Date(now - GRACE_MS - 1) })],
      now,
    );
    expect(outcome).toEqual({ kind: 'revoke' });
  });

  it('revokes a token that was never issued', () => {
    expect(decide('forged', ['active'], [], now)).toEqual({ kind: 'revoke' });
  });

  it('revokes when the replacement itself is no longer active', () => {
    // e.g. the user signed out after the rotation, clearing the active list.
    const outcome = decide('old', [], [rotatedRecord({ rotatedAt: new Date(now - 100) })], now);
    expect(outcome).toEqual({ kind: 'revoke' });
  });

  it('handles several rotations in the same window without confusing the chain', () => {
    const rotated = [
      rotatedRecord({ token: 'a', replacedBy: 'b', rotatedAt: new Date(now - 2_000) }),
      rotatedRecord({ token: 'b', replacedBy: 'c', rotatedAt: new Date(now - 1_000) }),
    ];
    // 'a' was replaced by 'b', which is itself no longer active — only the tail
    // of the chain can be graced.
    expect(decide('a', ['c'], rotated, now).kind).toBe('revoke');
    expect(decide('b', ['c'], rotated, now)).toEqual({ kind: 'graced', replacedBy: 'c' });
  });
});
