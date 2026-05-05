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
import { SearchBar } from './components/home/SearchBar';
import { TrendingGrid } from './components/home/TrendingGrid';
import { TrustSection } from './components/home/TrustSection';

import DealsPage from './pages/Deals';

function HomePage() {
  return (
    <>
      <Hero />
      <SearchBar />
      <TrendingGrid />
      <TrustSection />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
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
