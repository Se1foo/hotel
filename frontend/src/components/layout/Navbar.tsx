import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plane, Tag, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Explore', icon: Plane, id: 'explore' },
  { name: 'Deals', icon: Tag, id: 'deals' },
  { name: 'My Bookings', icon: BookOpen, id: 'bookings' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('explore');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-[background-color,border-color,box-shadow,opacity] duration-300 ${isScrolled ? 'bg-surface/90 backdrop-blur-md border-surface-variant/20 shadow-sm' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex justify-between items-center h-20 transition-all duration-300">
        <div className="flex items-center ml-16 md:ml-0">
          <span className={`font-h3 text-h3 tracking-tighter transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-on-primary'}`}>StayEase</span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2" onMouseLeave={() => setHoveredTab(null)}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href="#"
              onMouseEnter={() => setHoveredTab(link.id)}
              className={`relative flex items-center justify-center px-4 py-2 min-h-[44px] font-body-md text-body-md transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full ${
                isScrolled 
                  ? hoveredTab === link.id ? 'text-primary' : 'text-on-surface-variant' 
                  : hoveredTab === link.id ? 'text-on-primary' : 'text-on-primary/80'
              }`}
              aria-current={link.id === 'explore' ? 'page' : undefined}
            >
              <span className="relative z-10">{link.name}</span>
              {hoveredTab === link.id && (
                <motion.div
                  layoutId="navbar-hover"
                  className={`absolute inset-0 rounded-full ${isScrolled ? 'bg-primary/10' : 'bg-white/20'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </a>
          ))}
        </nav>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" className={`rounded-full border-2 px-6 py-2 min-h-[44px] font-body-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors duration-300 ${isScrolled ? 'border-primary text-primary hover:bg-primary hover:text-on-primary' : 'border-on-primary text-on-primary hover:bg-on-primary hover:text-primary bg-transparent backdrop-blur-sm'}`}>
            Sign In
          </Button>
        </motion.div>
      </div>
      
      {/* Mobile Nav (Bottom) */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 md:hidden bg-surface/90 backdrop-blur-lg border-t border-surface-variant/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveMobileTab(link.id); }}
            className={`relative flex flex-col items-center justify-center min-w-[72px] min-h-[44px] rounded-xl px-4 py-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              activeMobileTab === link.id ? 'text-primary font-bold' : 'text-outline hover:text-primary'
            }`}
            aria-current={activeMobileTab === link.id ? 'page' : undefined}
          >
            <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center z-10">
              <link.icon className="w-6 h-6 mb-1" aria-hidden="true" />
              <span className="font-label-caps text-[10px] uppercase tracking-widest">{link.name}</span>
            </motion.div>
            
            {activeMobileTab === link.id && (
              <motion.div
                layoutId="mobile-active"
                className="absolute inset-0 bg-primary/10 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </a>
        ))}
      </nav>
    </header>
  );
};
