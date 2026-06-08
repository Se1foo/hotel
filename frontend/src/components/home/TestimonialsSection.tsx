import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../lib/useMousePosition';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Helen Worden',
    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: 5,
  },
  {
    id: 2,
    name: 'Luke Coursey',
    text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  const mouse = useMousePosition();

  return (
    <section className="py-[80px] bg-surface relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Large U-Shape / Half circle with mouse parallax */}
        <div 
          className="absolute top-4 right-[15%] w-[120px] h-[60px] opacity-40 transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mouse.x * -12}px, ${mouse.y * -12}px, 0) rotate(${mouse.x * -3}deg)`,
          }}
        >
          <svg className="text-outline-variant w-full h-full" viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0,0 A60,60 0 0,0 120,0" />
          </svg>
        </div>
        
        {/* End Background Shapes */}
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-[60px] relative z-10">
        <h2 className="font-h2 text-headline-md text-on-surface mb-12">What our costumers say:</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {TESTIMONIALS.map((t, index) => (
            <motion.div 
              key={t.id} 
              className="relative flex items-center gap-6 group cursor-pointer"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Decorative dot for the first testimonial */}
              {index === 0 && (
                <motion.div 
                  className="absolute -left-6 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary hidden lg:block"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              
              <div className="shrink-0 w-[160px] h-[160px] overflow-hidden">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-102 transition-all duration-500"
                />
              </div>
              
              <div className="flex flex-col">
                <div className="flex text-primary mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <h3 className="font-h3 text-headline-sm text-on-surface mb-2">{t.name}</h3>
                <p className="font-body-md text-on-surface-variant max-w-[280px]">
                  {t.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
