import { motion } from 'framer-motion';
import { Search, CalendarCheck, Map } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover & Explore',
    description: 'Browse through our curated collection of luxury destinations and exclusive deals around the globe.'
  },
  {
    icon: CalendarCheck,
    title: 'Check & Book',
    description: 'Select your dates, specify your guest count, and securely book your premium suite in seconds.'
  },
  {
    icon: Map,
    title: 'Pack & Enjoy',
    description: 'Receive your itinerary and get ready for an unforgettable, world-class hospitality experience.'
  }
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-[#FAF9F6] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Yellow dots grid top right */}
        <div className="absolute top-[10%] right-[5%] grid grid-cols-4 gap-3 opacity-40">
          {[...Array(12)].map((_, i) => (
            <div key={`dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#8B6B10]"></div>
          ))}
        </div>
        
        {/* Double X marks at bottom left */}
        <div className="absolute bottom-[15%] left-[8%] flex gap-4 text-gray-300 font-medium text-2xl select-none">
          <span>x</span>
          <span>x</span>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            How It <span className="text-[#8B6B10]">Works</span>
          </h2>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
            Your journey to luxury begins here. Our streamlined process makes booking your next escape effortless.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Decorative Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-[25%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#EBEBEB] to-transparent z-0"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="relative z-10 flex flex-col items-center group cursor-default"
              >
                <div className="w-20 h-20 rounded-2xl bg-white shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] border border-[#F0F0F0] flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 relative">
                  <Icon className="w-8 h-8 text-[#1A1A1A] group-hover:text-[#8B6B10] transition-colors duration-300" />
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-sm font-bold shadow-md">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-[#666666] text-[15px] leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
