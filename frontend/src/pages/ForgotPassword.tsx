import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { getErrorMessage, useForgotPassword } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AuthCard } from '../components/auth/AuthCard';
import { Input } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof schema>;

/** Backs the login page's "Forgot password?" link, which used to be `href="#"`. */
export default function ForgotPasswordPage() {
  useDocumentTitle('Reset your password');

  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await forgotPassword.mutateAsync(values.email);
    } catch {
      // Surfaced via mutation state below.
    }
  };

  return (
    <AuthCard
      title="Forgot your"
      accent="password?"
      subtitle="Enter your email address and we'll send you a link to set a new one."
      footer={{ prompt: 'Remembered it?', linkLabel: 'Back to sign in', to: '/login' }}
    >
      {forgotPassword.isSuccess ? (
        <Alert tone="success">
          {/*
            The server returns the same message whether or not an account exists,
            so this page cannot be used to discover which addresses are
            registered.
          */}
          {forgotPassword.data}
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {forgotPassword.isError && (
            <Alert tone="error">
              {getErrorMessage(forgotPassword.error, 'We could not send the reset link.')}
            </Alert>
          )}

          <Input
            {...register('email')}
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            disabled={forgotPassword.isPending}
          />

          <Button type="submit" fullWidth size="lg" isLoading={forgotPassword.isPending}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
