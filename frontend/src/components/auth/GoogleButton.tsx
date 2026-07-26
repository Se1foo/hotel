import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '../ui/Button';
import { useAuth } from './useAuth';
import { getErrorMessage } from '../../lib/api';

/** Google's brand mark. Was inlined twice, once in Login and once in SignUp. */
function GoogleMark() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface GoogleButtonProps {
  label: string;
  /** Where to go after a successful sign-in. */
  redirectTo: string;
  onError: (message: string) => void;
  /** Lets the parent disable it while its own form is submitting. */
  disabled?: boolean;
  onNavigate: (path: string) => void;
}

/**
 * Owns the `useGoogleLogin` hook.
 *
 * Hooks cannot be called conditionally, so the hook has to live in a component
 * that is itself only rendered when Google auth is configured — otherwise the
 * SDK throws "Missing required parameter client_id" during render and unmounts
 * the whole page. Callers gate on `isGoogleAuthEnabled`.
 */
export function GoogleButton({
  label,
  redirectTo,
  onError,
  disabled,
  onNavigate,
}: GoogleButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const start = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
        onNavigate(redirectTo);
      } catch (error) {
        onError(getErrorMessage(error, 'Google sign-in failed.'));
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => onError('Google sign-in was cancelled or failed.'),
  });

  return (
    <Button
      variant="outline"
      size="lg"
      fullWidth
      isLoading={isLoading}
      disabled={disabled || isLoading}
      onClick={() => start()}
    >
      <GoogleMark />
      {label}
    </Button>
  );
}

/** The "Or continue with" rule — also duplicated across both auth pages. */
export function AuthDivider({ children = 'Or continue with' }: { children?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-line" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-3 bg-surface text-sm text-ink-subtle">{children}</span>
      </div>
    </div>
  );
}
