import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../lib/useMousePosition';
import heroImg from '../../images/hero_pool.png';

export const Hero = () => {
  const mouse = useMousePosition();
  const navigate = useNavigate();

  return (
    <section className="relative pt-[110px] pb-[60px] bg-surface overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Pencil squiggle on the far left */}
        <div 
          className="absolute top-[22%] left-[4%] transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mouse.x * 15}px, ${mouse.y * 15}px, 0)`,
          }}
        >
          <svg className="w-24 h-16 text-surface-dim opacity-70" viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10,25 Q20,10 35,30 T60,20 T80,40 T95,15" />
          </svg>
        </div>

        {/* Pill outline on the left edge */}
        <div 
          className="absolute top-[42%] left-[-40px] w-24 h-9 border-2 border-surface-dim rounded-full opacity-70 transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mouse.x * 10}px, ${mouse.y * 10}px, 0)`,
          }}
        ></div>

        {/* Double X marks at bottom center */}
        <div 
          className="absolute bottom-[10%] left-[40%] flex gap-4 text-on-surface-variant/80 font-medium text-xl transition-transform duration-500 ease-out select-none"
          style={{
            transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 6}px, 0)`,
          }}
        >
          <span>x</span>
          <span>x</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          {/* Left Text Content */}
          <div className="relative z-10">
            <h1 className="font-h1 text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
              Elevate your <br className="hidden md:block" />
              <span className="text-primary">Vacation</span> with our <br className="hidden md:block" />
              Luxury Resort.
            </h1>
            
            <p className="font-body-lg text-on-surface-variant max-w-[500px] mb-6">
              Experience world-class hospitality:
            </p>
            
            <ul className="space-y-3 mb-10 font-body-lg text-on-surface">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Premium ocean-view suites
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                24/7 personal service
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Fine dining and local cuisine
              </li>
            </ul>
            
            <div className="flex flex-wrap items-center gap-6">
              <button 
                onClick={() => navigate('/destinations')}
                className="bg-secondary text-on-secondary font-label-bold px-8 py-4 rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-102"
              >
                Book your room
              </button>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="relative">
            {/* Decorative dots top right - 5x2 grid of grey dots */}
            <div 
              className="absolute -top-6 -right-6 z-0 grid grid-cols-5 gap-2 opacity-60 transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 6}px, 0)`,
              }}
            >
              {[...Array(10)].map((_, i) => (
                <div key={`dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div>
              ))}
            </div>

            {/* Decorative 2x2 grid of yellow circles/dots to the left */}
            <div 
              className="absolute -left-6 top-[45%] z-20 grid grid-cols-2 gap-2 transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouse.x * -8}px, ${mouse.y * -8}px, 0)`,
              }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={`ydot-${i}`} 
                  className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                ></motion.div>
              ))}
            </div>

            {/* Main Image Container */}
            <div 
              className="relative z-10 w-full h-[440px] rounded-lg overflow-hidden shadow-ambient-elevated border-[12px] border-surface transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${mouse.x * 3}px, ${mouse.y * 3}px, 0)`,
              }}
            >
              <img 
                src={heroImg} 
                alt="Hero Image" 
                className="w-full h-full object-cover"
              />
              
              {/* Yellow bar bottom-left overlay (extending left) */}
              <div className="absolute bottom-0 left-[-80px] w-[45%] h-6 bg-primary z-20"></div>
              
              {/* Yellow bar bottom-right overlay (extending right) */}
              <div className="absolute bottom-0 right-[-80px] w-[45%] h-6 bg-primary z-20"></div>
            </div>

            {/* Dark charcoal block bottom-right */}
            <div 
              className="absolute bottom-[-16px] right-[-16px] w-[50px] h-[50px] bg-secondary z-0 transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouse.x * 4}px, ${mouse.y * 4}px, 0)`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};
