import { Link } from 'react-router-dom';
import { Share2, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface pt-[80px] pb-6 border-t border-surface-variant">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M6 4C13 12 13 20 6 28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 4C23 12 23 20 16 28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex flex-col ml-1">
                <span className="font-h1 font-bold text-2xl leading-none tracking-tighter text-on-surface">HOTEL.</span>
                <span className="font-body-md text-[8px] tracking-[0.2em] text-on-surface-variant uppercase mt-1">For your vacation</span>
              </div>
            </Link>
            <p className="font-body-md text-on-surface-variant max-w-[250px]">
              Experience luxury and comfort in every stay. Your perfect vacation starts here.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" aria-label="Share">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="mailto:info@hotel.com" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-label-bold text-on-surface uppercase tracking-widest text-sm mb-2">Explore</h4>
            <Link to="/rooms" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Rooms</Link>
            <Link to="/amenities" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Amenities</Link>
            <Link to="/offers" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Special Offers</Link>
            <Link to="/locations" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Locations</Link>
          </div>

          {/* Legal Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-label-bold text-on-surface uppercase tracking-widest text-sm mb-2">Legal</h4>
            <Link to="/privacy" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/faq" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">FAQ</Link>
            <Link to="/sitemap" className="font-body-md text-on-surface-variant hover:text-primary transition-colors">Sitemap</Link>
          </div>

          {/* Newsletter Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-label-bold text-on-surface uppercase tracking-widest text-sm mb-2">Newsletter</h4>
            <p className="font-body-md text-on-surface-variant">
              Subscribe to get special offers and updates.
            </p>
            <form className="relative mt-2 flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-surface-container-lowest border border-surface-variant text-on-surface font-body-md pl-4 pr-12 py-3 rounded-full focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary hover:bg-primary hover:text-on-primary transition-colors"
                aria-label="Subscribe"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-surface-variant">
          <p className="font-body-md text-on-surface-variant text-sm mb-4 md:mb-0">
            © 2024 HOTEL. For your vacation. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button className="font-body-md text-on-surface-variant hover:text-on-surface text-sm transition-colors">EN</button>
            <span className="text-surface-variant">|</span>
            <button className="font-body-md text-on-surface-variant hover:text-on-surface text-sm transition-colors">USD</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
