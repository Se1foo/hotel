import { motion } from 'framer-motion';
import { ShieldCheck, CalendarCheck, Headset } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Best Price Guarantee',
    description: 'We match any lower price found online to ensure you always get the best deal for your luxury stay.'
  },
  {
    icon: CalendarCheck,
    title: 'Free Cancellation',
    description: 'Plans change. Enjoy flexible booking options with free cancellation on most of our premium properties.'
  },
  {
    icon: Headset,
    title: '24/7 Support',
    description: 'Our dedicated concierge team is available around the clock to assist you with any request, anywhere.'
  }
];

export const TrustSection = () => {
  return (
    <section className="bg-surface-container-low py-section-padding mt-16">
      <div className="max-w-container-max mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center group cursor-default"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-16 h-16 rounded-full bg-surface shadow-[0_4px_16px_rgba(4,22,39,0.05)] flex items-center justify-center mb-6 text-primary group-hover:shadow-[0_8px_24px_rgba(4,22,39,0.1)] group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300"
            >
              <feature.icon className="w-8 h-8" strokeWidth={1.5} aria-hidden="true" />
            </motion.div>
            <h3 className="font-h3 text-h3 text-on-surface mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
