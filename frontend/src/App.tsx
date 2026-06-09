import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { RoomsSection } from './components/home/RoomsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';

import DealsPage from './pages/Deals';
import DestinationsPage from './pages/Destinations';
import DestinationDetailsPage from './pages/DestinationDetails';
import MyTripsPage from './pages/MyTrips';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import VerifyEmailPage from './pages/VerifyEmail';
import ContactPage from './pages/Contact';

import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  return (
    <>
      <Hero />
      <RoomsSection />
      <TestimonialsSection />
    </>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/deals" element={<PageWrapper><DealsPage /></PageWrapper>} />
        <Route path="/destinations" element={<PageWrapper><DestinationsPage /></PageWrapper>} />
        <Route path="/destination/:id" element={<PageWrapper><DestinationDetailsPage /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route
          path="/trips"
          element={
            <PageWrapper>
              <ProtectedRoute>
                <MyTripsPage />
              </ProtectedRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <ProtectedRoute redirectIfAuth>
                <LoginPage />
              </ProtectedRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <PageWrapper>
              <ProtectedRoute redirectIfAuth>
                <SignUpPage />
              </ProtectedRoute>
            </PageWrapper>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PageWrapper>
              <VerifyEmailPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col overflow-x-hidden relative">
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.025] flex justify-between max-w-[1280px] mx-auto px-5 md:px-[60px]">
              <div className="w-[1px] h-full bg-on-surface"></div>
              <div className="w-[1px] h-full bg-on-surface hidden md:block"></div>
              <div className="w-[1px] h-full bg-on-surface hidden md:block"></div>
              <div className="w-[1px] h-full bg-on-surface hidden md:block"></div>
              <div className="w-[1px] h-full bg-on-surface"></div>
            </div>

            <Navbar />
            <main className="flex-grow relative z-10 w-full">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
