import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { getErrorMessage, useResetPassword } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { useToast } from '../components/ui/toast/useToast';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

/** Mirrors the backend's shared `passwordSchema`. */
const schema = z
  .object({
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

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  useDocumentTitle('Set a new password');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { notify } = useToast();
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (!token) return;
    try {
      await resetPassword.mutateAsync({ token, password: values.password });
      notify('Password updated. You can sign in now.', 'success');
      navigate('/login', { replace: true });
    } catch {
      // Surfaced via mutation state below.
    }
  };

  // A missing token is knowable immediately, so say so rather than presenting a
  // form that can only fail on submit.
  if (!token) {
    return (
      <AuthCard
        title="Link"
        accent="incomplete"
        subtitle="This password reset link is missing its token."
        footer={{ prompt: 'Need a new link?', linkLabel: 'Request one', to: '/forgot-password' }}
      >
        <Alert tone="error">
          Please open the most recent reset link from your email, or{' '}
          <Link to="/forgot-password" className="font-bold underline">
            request a new one
          </Link>
          .
        </Alert>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set a new"
      accent="password"
      subtitle="Choose something you haven't used before. This will sign you out everywhere else."
      footer={{ prompt: 'Changed your mind?', linkLabel: 'Back to sign in', to: '/login' }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {resetPassword.isError && (
          <Alert tone="error">
            {getErrorMessage(resetPassword.error, 'We could not reset your password.')}
          </Alert>
        )}

        <PasswordInput
          {...register('password')}
          label="New password"
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          icon={<Lock className="w-5 h-5" />}
          hint="At least 8 characters, with upper and lower case, a number and a symbol."
          error={errors.password?.message}
          disabled={resetPassword.isPending}
        />

        <PasswordInput
          {...register('confirmPassword')}
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          icon={<Lock className="w-5 h-5" />}
          error={errors.confirmPassword?.message}
          disabled={resetPassword.isPending}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={resetPassword.isPending}
          className="mt-2"
        >
          Update password
        </Button>
      </form>
    </AuthCard>
  );
}
