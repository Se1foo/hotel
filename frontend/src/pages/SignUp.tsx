import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../components/auth/useAuth';
import { AuthCard } from '../components/auth/AuthCard';
import { AuthDivider, GoogleButton } from '../components/auth/GoogleButton';
import { isGoogleAuthEnabled } from '../config/auth';
import { Input, PasswordInput } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { getErrorMessage } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';

/** Mirrors the backend's shared `passwordSchema` so client and server agree. */
const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your full name'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Include at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  useDocumentTitle('Create an account');

  const { register: registerAccount } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (values: SignUpFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await registerAccount(values.name, values.email, values.password);
      setSuccessMessage(
        'Account created. Check your inbox for a verification link, then sign in.',
      );
      // Clear the form so filled fields don't sit behind the success notice.
      reset();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Registration failed. Please check your details and try again.'),
      );
    }
  };

  return (
    <AuthCard
      title="Create"
      accent="account"
      subtitle="Join for curated stays, member rates and instant confirmation."
      footer={{ prompt: 'Already have an account?', linkLabel: 'Sign in', to: '/login' }}
    >
      {errorMessage && (
        <Alert tone="error" className="mb-6">
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert tone="success" className="mb-6">
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          {...register('name')}
          label="Full name"
          autoComplete="name"
          placeholder="Jordan Rivera"
          icon={<User className="w-5 h-5" />}
          error={errors.name?.message}
          disabled={isSubmitting}
        />

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
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          icon={<Lock className="w-5 h-5" />}
          hint="At least 8 characters, with upper and lower case, a number and a symbol."
          error={errors.password?.message}
          disabled={isSubmitting}
        />

        <PasswordInput
          {...register('confirmPassword')}
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          icon={<Lock className="w-5 h-5" />}
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
        />

        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-2">
          Create account
        </Button>
      </form>

      {/* Only mounted when Google auth is configured — see `config/auth.ts`. */}
      {isGoogleAuthEnabled && (
        <>
          <AuthDivider />
          <GoogleButton
            label="Sign up with Google"
            redirectTo="/"
            disabled={isSubmitting}
            onError={setErrorMessage}
            onNavigate={(path) => navigate(path, { replace: true })}
          />
        </>
      )}
    </AuthCard>
  );
}
