import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { site } from '../../config/site';
import { Section, SectionHeading, Shell } from '../ui/Section';
import { CrossMarks, DotGrid } from '../ui/Decor';
import { StarRating } from '../ui/StarRating';
import { SmartImage } from '../ui/SmartImage';

const TESTIMONIALS = [
  {
    id: 'helen-worden',
    name: 'Helen Worden',
    role: 'Anniversary trip to Santorini',
    quote: `${site.name} made our anniversary trip absolutely perfect. The recommendations were spot on and the booking process was completely seamless.`,
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    rating: 5,
  },
  {
    id: 'luke-coursey',
    name: 'Luke Coursey',
    role: 'Books 30+ nights a year',
    quote:
      'I travel constantly for work and this has been a genuine upgrade. Exclusive rates, and an interface that actually gets out of my way.',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    rating: 5,
  },
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    role: 'Family stay in the Swiss Alps',
    quote:
      'Booking for four with two kids is usually a nightmare. Here it took five minutes and the suite was exactly as pictured.',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <Section tone="canvas" spacing="lg">
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" aria-hidden="true">
        <DotGrid className="top-[45%] left-[3%] opacity-30" columns={3} count={9} tone="amber" depth={8} />
        <CrossMarks className="bottom-[20%] right-[8%]" depth={5} />
      </div>

      <Shell className="relative z-10">
        <SectionHeading
          eyebrow="Guest stories"
          title="What our guests"
          accent="say"
          subtitle="Thousands of stays booked, and these are the reviews we're proudest of."
        />

        {/* Was a 2-column grid holding 2 cards whose copy was clamped to 280px,
            leaving lopsided whitespace. Three even cards fill the row. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.figure
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-surface border border-line rounded-panel p-7 shadow-card flex flex-col h-full"
            >
              <Quote className="w-8 h-8 text-amber mb-5 shrink-0" aria-hidden="true" />

              <blockquote className="text-ink leading-relaxed text-pretty flex-grow">
                {testimonial.quote}
              </blockquote>

              <figcaption className="flex items-center gap-4 mt-7 pt-6 border-t border-line">
                <SmartImage
                  src={testimonial.image}
                  alt={`Portrait of ${testimonial.name}`}
                  width={112}
                  height={112}
                  wrapperClassName="w-14 h-14 rounded-full shrink-0"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="min-w-0">
                  <p className="font-bold text-ink truncate">{testimonial.name}</p>
                  <p className="text-sm text-ink-muted truncate">{testimonial.role}</p>
                  <StarRating value={testimonial.rating} size="sm" className="mt-1.5" />
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Shell>
    </Section>
  );
}
