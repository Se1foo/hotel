import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../components/auth/useAuth';
import { AuthCard } from '../components/auth/AuthCard';
import { AuthDivider, GoogleButton } from '../components/auth/GoogleButton';
import { isGoogleAuthEnabled } from '../config/auth';
import { Input, PasswordInput } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { getErrorMessage } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  useDocumentTitle('Sign in');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // `ProtectedRoute` stores a plain pathname string rather than a Location
  // object, which is what the old code pushed into router state.
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Failed to sign in. Please check your credentials and try again.'),
      );
    }
  };

  return (
    <AuthCard
      title="Welcome"
      accent="back"
      subtitle="Sign in to manage your reservations and itineraries."
      footer={{ prompt: "Don't have an account?", linkLabel: 'Create one', to: '/signup' }}
    >
      {errorMessage && (
        <Alert tone="error" className="mb-6">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          {...register('email')}
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          disabled={isSubmitting}
        />

        <PasswordInput
          {...register('password')}
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
          error={errors.password?.message}
          disabled={isSubmitting}
          // Was `<a href="#">Forgot password?</a>` — a link to nowhere. There is
          // now a real reset flow behind it.
          action={
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-gold hover:text-gold-dark hover:underline"
            >
              Forgot password?
            </Link>
          }
        />

        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      {/* Rendered only when a Google client ID is configured. The hook inside
          `GoogleButton` throws during render without one, which used to crash
          this entire page rather than just hiding one option. */}
      {isGoogleAuthEnabled && (
        <>
          <AuthDivider />
          <GoogleButton
            label="Sign in with Google"
            redirectTo={from}
            disabled={isSubmitting}
            onError={setErrorMessage}
            onNavigate={(path) => navigate(path, { replace: true })}
          />
        </>
      )}
    </AuthCard>
  );
}
