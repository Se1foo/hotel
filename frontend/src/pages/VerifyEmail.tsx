import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../lib/axios';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const verify = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.error || 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center pt-32 pb-16 px-5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.03)] border border-[#F0F0F0] p-10 text-center"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#8B6B10] animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Verifying Email</h2>
            <p className="text-gray-500">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Verified!</h2>
            <p className="text-gray-500 mb-8">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#1A1A1A] text-white font-bold py-3 px-8 rounded-full hover:bg-[#8B6B10] transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-8">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#F0F0F0] text-[#1A1A1A] font-bold py-3 px-8 rounded-full hover:bg-[#E0E0E0] transition-colors"
            >
              Return to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
