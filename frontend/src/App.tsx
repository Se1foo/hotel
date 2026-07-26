import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { isAxiosError } from 'axios';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ToastProvider } from './components/ui/toast/ToastProvider';
import { LoadingState } from './components/ui/States';

import HomePage from './pages/Home';

// Everything below the first paint is split out. Previously the entire app —
// including MUI and every page — shipped in a single bundle.
const DealsPage = lazy(() => import('./pages/Deals'));
const DestinationsPage = lazy(() => import('./pages/Destinations'));
const DestinationDetailsPage = lazy(() => import('./pages/DestinationDetails'));
const MyTripsPage = lazy(() => import('./pages/MyTrips'));
const SavedPage = lazy(() => import('./pages/Saved'));
const LoginPage = lazy(() => import('./pages/Login'));
const SignUpPage = lazy(() => import('./pages/SignUp'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPassword'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmail'));
const ContactPage = lazy(() => import('./pages/Contact'));
const LegalPage = lazy(() => import('./pages/Legal'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Retrying a 4xx just burns rate limit — the request was wrong, not unlucky.
        if (isAxiosError(error)) {
          const status = error.response?.status ?? 0;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      // Mutations are not idempotent in general; a failed booking must not be
      // silently retried into a duplicate.
      retry: false,
    },
  },
});

/**
 * Restores scroll on navigation. Deliberately instant rather than smooth — a
 * smooth scroll here fights the page transition.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/**
 * Route transition.
 *
 * This deliberately does **not** use `AnimatePresence`. The previous version
 * wrapped `<Suspense>` in `<AnimatePresence mode="wait">`, but AnimatePresence
 * can only drive an exit animation on a direct child that participates in
 * presence — `Suspense` does not. So `mode="wait"` waited forever for an exit
 * that never completed: clicking any in-app link changed the URL and left the
 * previous page on screen. Testing via full page loads masked it entirely.
 *
 * A keyed enter-only animation gives the same perceived polish, cannot deadlock,
 * and honours `prefers-reduced-motion` by starting at the final state.
 */
function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
      <Suspense fallback={<LoadingState message="Loading…" />}>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destination/:id" element={<DestinationDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<LegalPage kind="privacy" />} />
            <Route path="/terms" element={<LegalPage kind="terms" />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <MyTripsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <SavedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute redirectIfAuth>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute redirectIfAuth>
                  <SignUpPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <ProtectedRoute redirectIfAuth>
                  <ForgotPasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all — unknown paths used to render an empty page. */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <ScrollToTop />

              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-3 focus:bg-ink focus:text-ink-inverse focus:rounded-full focus:font-bold focus:text-sm"
              >
                Skip to content
              </a>

              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main id="main" className="flex-grow w-full">
                  <AppRoutes />
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
