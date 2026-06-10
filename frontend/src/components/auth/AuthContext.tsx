import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api, { setAccessToken } from '../../lib/axios';
import type { User } from '../../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user: loggedUser } = response.data;
      setAccessToken(accessToken);
      setUser(loggedUser);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (token: string, isAccessToken: boolean = false) => {
    setIsLoading(true);
    try {
      const payload = isAccessToken ? { access_token: token } : { credential: token };
      const response = await api.post('/auth/google', payload);
      const { accessToken, user: loggedUser } = response.data;
      setAccessToken(accessToken);
      setUser(loggedUser);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      // We do not auto-login anymore, user must verify email.
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error on server', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to refresh token silently on load
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;
        setAccessToken(accessToken);
        
        // Fetch current user details
        const meResponse = await api.get('/auth/me');
        setUser(meResponse.data.user);
      } catch (error) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen to custom logout events triggered by interceptor refresh failures
    const handleAuthLogout = () => {
      setAccessToken(null);
      setUser(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        googleLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
