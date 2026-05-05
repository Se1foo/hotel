export const Footer = () => {
  return (
    <footer className="w-full bg-surface py-12 pb-24 md:pb-12">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <span className="text-lg font-semibold text-on-surface font-h3 tracking-tight">StayEase</span>
          <p className="font-body-md text-sm text-on-surface-variant mt-2">© 2024 StayEase Luxury Hotels. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:justify-end">
          {['Privacy Policy', 'Terms of Service', 'Contact Us', 'Press Kit'].map((link) => (
            <a key={link} className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors" href="#">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
