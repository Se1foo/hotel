import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import api, { setAccessToken } from '../../lib/axios';
import type { User } from '../../types';
import { AuthContext, type AuthContextValue } from './authContext';

/**
 * In-flight session restore, shared across callers.
 *
 * StrictMode invokes mount effects twice in development, which fired two
 * `/auth/refresh` requests. Since the server rotates refresh tokens, the second
 * request presented an already-rotated token and failed — logging the user out
 * on every page load. The server now has a rotation grace window too, but
 * single-flighting here is the correct client-side behaviour regardless: one
 * page load should mean one refresh.
 */
let restoreInFlight: Promise<User | null> | null = null;

async function restoreSessionOnce(): Promise<User | null> {
  if (restoreInFlight) return restoreInFlight;

  restoreInFlight = (async () => {
    const { data } = await api.post('/auth/refresh');
    setAccessToken(data.accessToken);
    const me = await api.get('/auth/me');
    return me.data.user as User;
  })();

  try {
    return await restoreInFlight;
  } finally {
    // Cleared either way so a later sign-in/out can restore again.
    restoreInFlight = null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  /**
   * The context type used to declare a single `credential` parameter while the
   * implementation took `(token, isAccessToken)` — callers passed two arguments
   * and `tsc -b` failed with TS2554. The dual ID-token/access-token handling is
   * gone; the frontend uses the implicit access-token flow only.
   */
  const loginWithGoogle = useCallback(async (accessToken: string) => {
    const { data } = await api.post('/auth/google', { access_token: accessToken });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    // Deliberately does not sign the user in — they must verify their email first.
    await api.post('/auth/register', { name, email, password });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // A failed server-side logout must not trap the user in a signed-in UI,
      // so the local session is cleared regardless.
      console.error('Logout request failed; clearing local session anyway.', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const restored = await restoreSessionOnce();
        if (!cancelled) setUser(restored);
      } catch {
        // No valid refresh cookie — the expected state for a signed-out visitor.
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void restoreSession();

    // The axios interceptor fires this when a token refresh fails mid-session.
    const handleForcedLogout = () => {
      setAccessToken(null);
      setUser(null);
    };
    window.addEventListener('auth-logout', handleForcedLogout);

    return () => {
      cancelled = true;
      window.removeEventListener('auth-logout', handleForcedLogout);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
    }),
    [user, isLoading, login, loginWithGoogle, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
