import { Hero } from '../components/home/Hero';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { RoomsSection } from '../components/home/RoomsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';

/**
 * Section tones deliberately alternate canvas → muted → canvas → canvas so the
 * bands read as intentional. The original stacked `#fbf9f9`, `#FAF9F6`,
 * `#FAF9F6` and `bg-surface` — four near-identical creams that produced faint
 * seams rather than rhythm.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorksSection />
      <RoomsSection />
      <TestimonialsSection />
    </>
  );
}
