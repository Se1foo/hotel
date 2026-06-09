import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { LogOut } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Deals', path: '/deals' },
  { name: 'My Trips', path: '/trips' },
  { name: 'Contact us', path: '/contact' },
];

export const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

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
                  <motion.span 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons / Profile Details */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="font-bold text-[14px] text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors px-2 py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#1A1A1A] text-white font-bold text-[14px] px-6 py-2.5 rounded-full hover:bg-[#8B6B10] transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="bg-white border border-[#F0F0F0] text-[#1A1A1A] font-bold text-[14px] px-6 py-2.5 rounded-full hover:bg-[#F9F9F9] hover:text-red-600 hover:border-red-200 transition-all shadow-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          )}
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
