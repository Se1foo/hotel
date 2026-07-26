import { createContext } from 'react';
import type { User } from '../../types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True only during the initial silent-refresh check on mount. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Exchanges a Google OAuth **access token** for a session. */
  loginWithGoogle: (accessToken: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * The context object lives apart from the provider component so that neither
 * module mixes component and non-component exports, which disables Fast Refresh
 * for the whole file.
 */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
