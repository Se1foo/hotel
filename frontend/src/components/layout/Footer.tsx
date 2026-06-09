import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#EBEBEB] py-16 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4 text-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-[#8B6B10] text-[#8B6B10]" />
              <span className="font-extrabold text-[22px] tracking-widest uppercase">Luxe Reserve</span>
            </div>
            <p className="font-medium text-[14px]">
              © 2024 Luxe Reserve. Artistic Geometry & Modern Hospitality.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-[14px] font-bold text-[#4A4A4A]">
            <Link to="/privacy" className="hover:text-[#8B6B10] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#8B6B10] transition-colors">Terms of Service</Link>
            <Link to="/support" className="hover:text-[#8B6B10] transition-colors">Contact Support</Link>
          </div>

        </div>
      </div>
    </footer>
  );
};
