import { motion } from 'framer-motion';
import { CalendarCheck, Map, Search } from 'lucide-react';
import { Section, SectionHeading, Shell } from '../ui/Section';
import { CrossMarks, DotGrid } from '../ui/Decor';

const STEPS = [
  {
    icon: Search,
    title: 'Discover & Explore',
    description:
      'Browse a curated collection of luxury destinations and exclusive deals around the globe.',
  },
  {
    icon: CalendarCheck,
    title: 'Check & Book',
    description:
      'Select your dates, set your guest count, and reserve your suite in a matter of seconds.',
  },
  {
    icon: Map,
    title: 'Pack & Enjoy',
    description:
      'Get your itinerary instantly and arrive to world-class hospitality, sorted end to end.',
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

const item = {
  hidden: { opacity: 0, y: 24 },
  // `ease: 'easeOut'` as a bare string failed to typecheck against Framer's
  // `Easing` union; a cubic-bezier tuple is both valid and explicit.
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
} as const;

export function HowItWorksSection() {
  return (
    <Section tone="muted" spacing="lg">
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" aria-hidden="true">
        <DotGrid className="top-[10%] right-[5%] opacity-40" columns={4} count={12} tone="amber" />
        <CrossMarks className="bottom-[15%] left-[8%]" />
      </div>

      <Shell className="relative z-10">
        <SectionHeading
          align="center"
          eyebrow="Simple by design"
          title="How It"
          accent="Works"
          subtitle="Your journey to luxury begins here. Three steps, no friction, no phone calls."
        />

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 relative mt-16"
        >
          {/* Connector rule, drawn behind the icon tiles. */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-10 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-line-strong to-transparent z-0"
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                variants={item}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-panel bg-surface shadow-card border border-line flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 relative">
                  <Icon
                    className="w-8 h-8 text-ink group-hover:text-gold transition-colors duration-300"
                    aria-hidden="true"
                  />
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ink text-ink-inverse flex items-center justify-center text-sm font-bold shadow-card">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-2xl text-ink mb-3">{step.title}</h3>
                <p className="text-ink-muted text-[15px] leading-relaxed max-w-[280px] text-pretty">
                  {step.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ol>
      </Shell>
    </Section>
  );
}
