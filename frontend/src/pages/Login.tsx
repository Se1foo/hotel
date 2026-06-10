import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '../components/auth/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const googleLoginFn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await googleLogin(tokenResponse.access_token, true);
        navigate(from, { replace: true });
      } catch (err: any) {
        setErrorMessage(err.response?.data?.error || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setErrorMessage('Google Login Failed'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  // Determine redirection path (fallback to home)
  const from = (location.state as any)?.from?.pathname || '/';

  const onSubmit = async (data: LoginFormInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || 'Failed to authenticate. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex items-center justify-center pt-32 pb-16 px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.03)] border border-[#F0F0F0] overflow-hidden p-8 md:p-10"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            Welcome <span className="text-[#8B6B10]">Back</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Access your sanctuary and manage your retreats
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-start gap-3 text-sm"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-[#FAF9F6] border border-[#EBEBEB] focus:border-[#8B6B10] rounded-2xl outline-none text-[#1A1A1A] placeholder-gray-400 text-sm transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-semibold pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest block">
                Password
              </label>
              <a href="#" className="text-xs text-[#8B6B10] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-[#FAF9F6] border border-[#EBEBEB] focus:border-[#8B6B10] rounded-2xl outline-none text-[#1A1A1A] placeholder-gray-400 text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-semibold pl-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A1A1A] hover:bg-[#8B6B10] text-white font-bold py-3.5 px-4 rounded-full transition-colors duration-300 shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => googleLoginFn()}
              disabled={isLoading}
              className="w-full bg-white border border-[#D1D1D1] hover:bg-[#F9F9F9] text-[#1A1A1A] font-bold py-3.5 px-4 rounded-full transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              Sign in with Google
            </button>
          </div>
        </div>

        {/* Toggle Sign Up */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#8B6B10] font-bold hover:underline">
            Create account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
