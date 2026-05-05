import { motion } from 'framer-motion';
import heroImage from '../../images/hero.jpg';

export const Hero = () => {
  return (
    <section className="relative w-full h-[716px] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img alt="Luxury resort infinity pool overlooking a serene mountain range at sunrise" className="w-full h-full object-cover object-center" src={heroImage} fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent"></div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto mt-[-100px]"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="font-h1 text-4xl md:text-h1 text-on-primary mb-4 md:mb-6 drop-shadow-lg leading-tight"
        >
          Find Your Next Sanctuary
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="font-body-lg text-base md:text-body-lg text-on-primary/90 max-w-2xl mx-auto drop-shadow-md"
        >
          Book unique stays at the best prices, curated for the sophisticated traveler seeking peace and precision.
        </motion.p>
      </motion.div>
    </section>
  );
};
