import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { SearchBar } from './components/home/SearchBar';
import { TrendingGrid } from './components/home/TrendingGrid';
import { TrustSection } from './components/home/TrustSection';

function App() {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <SearchBar />
        <TrendingGrid />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
