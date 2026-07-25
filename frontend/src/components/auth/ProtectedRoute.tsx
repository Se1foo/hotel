import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoadingState } from '../ui/States';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Use on /login and /signup to bounce already-authenticated users home. */
  redirectIfAuth?: boolean;
}

export function ProtectedRoute({ children, redirectIfAuth = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingState message="Restoring your session" className="min-h-[60vh]" />;
  }

  if (redirectIfAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!redirectIfAuth && !isAuthenticated) {
    // `pathname` only — the previous code stashed whole Location objects
    // (sometimes `window.location`) in router state, which is not serialisable.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
