import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/axios';
import { getErrorMessage } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useDocumentTitle } from '../lib/useDocumentTitle';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  useDocumentTitle('Verify your email');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Derived from the token's presence rather than set in an effect — a missing
  // token is knowable on the first render, so there's nothing to synchronise.
  const [status, setStatus] = useState<Status>(() => (token ? 'loading' : 'error'));
  const [message, setMessage] = useState(() =>
    token
      ? 'Verifying your email address…'
      : 'This verification link is missing its token. Please use the link from your email.',
  );

  // StrictMode runs effects twice in development; without this guard the
  // single-use token is consumed by the first call and the second reports an
  // "invalid token" error over the successful result.
  const hasVerified = useRef(false);

  useEffect(() => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    api
      .post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success');
        setMessage('Your email is verified. You can sign in now.');
      })
      .catch((error) => {
        setStatus('error');
        setMessage(
          getErrorMessage(error, 'Verification failed. This link may have expired or already been used.'),
        );
      });
  }, [token]);

  const content = {
    loading: {
      icon: <Spinner size="lg" label={null} />,
      heading: 'Verifying your email',
      action: null,
    },
    success: {
      icon: <CheckCircle className="w-14 h-14 text-success" aria-hidden="true" />,
      heading: 'Email verified',
      action: (
        <Button size="lg" to="/login">
          Continue to sign in
        </Button>
      ),
    },
    error: {
      icon: <XCircle className="w-14 h-14 text-danger" aria-hidden="true" />,
      heading: 'Verification failed',
      action: (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" size="lg" to="/signup">
            Create a new account
          </Button>
          <Button size="lg" to="/login">
            Back to sign in
          </Button>
        </div>
      ),
    },
  }[status];

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-surface rounded-panel shadow-panel border border-line p-10 text-center flex flex-col items-center"
      >
        <div className="mb-6">{content.icon}</div>
        <h1 className="text-2xl text-ink mb-3">{content.heading}</h1>
        <p role="status" className="text-ink-muted text-pretty mb-8">
          {message}
        </p>
        {content.action}
      </motion.div>
    </div>
  );
}
