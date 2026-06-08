import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { RoomsSection } from './components/home/RoomsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';

import DealsPage from './pages/Deals';

function HomePage() {
  return (
    <>
      <Hero />
      <RoomsSection />
      <TestimonialsSection />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col overflow-x-hidden relative">
        {/* Global Architectural Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.025] flex justify-between max-w-[1280px] mx-auto px-5 md:px-[60px]">
          <div className="w-[1px] h-full bg-on-surface"></div>
          <div className="w-[1px] h-full bg-on-surface hidden md:block"></div>
          <div className="w-[1px] h-full bg-on-surface hidden md:block"></div>
          <div className="w-[1px] h-full bg-on-surface hidden md:block"></div>
          <div className="w-[1px] h-full bg-on-surface"></div>
        </div>

        <Navbar />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deals" element={<DealsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
