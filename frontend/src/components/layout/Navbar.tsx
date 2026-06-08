import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Promo', path: '/promo' },
  { name: 'Booking', path: '/booking' },
  { name: 'Special', path: '/special' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact us', path: '/contact' },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="absolute top-0 w-full z-50 bg-surface">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px] flex justify-between items-center h-24">
        <div className="flex items-center">
          <Link to="/">
            <div className="flex items-center gap-2">
              <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M6 4C13 12 13 20 6 28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 4C23 12 23 20 16 28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex flex-col ml-1">
                <span className="font-h1 font-bold text-2xl leading-none tracking-tighter text-on-surface">HOTEL.</span>
                <span className="font-body-md text-[8px] tracking-[0.2em] text-on-surface-variant uppercase mt-1">For your vacation</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '');
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-nav-link text-nav-link relative py-2 transition-colors ${
                  isActive ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-surface-container-high/80 text-on-surface font-body-md pl-4 pr-10 py-2 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary/50 w-48 placeholder:text-on-surface-variant backdrop-blur-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          </div>
        </div>
        
        {/* Mobile menu toggle placeholder */}
        <div className="md:hidden">
          <button className="text-on-surface p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
