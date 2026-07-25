import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useMousePosition } from '../../lib/useMousePosition';
import { Shell } from '../ui/Section';
import { Button } from '../ui/Button';
import { CrossMarks, DotGrid, PillOutline, Squiggle } from '../ui/Decor';
import heroImage from '../../images/hero_pool.png';

const HIGHLIGHTS = [
  'Premium ocean-view suites',
  '24/7 personal concierge service',
  'Fine dining and local cuisine',
];

export function Hero() {
  const mouse = useMousePosition();

  return (
    /**
     * Top padding is deliberately tight. At `pt-12 md:pt-16` the headline sat
     * ~110px below the navbar, which pushed the whole column down far enough
     * that the CTA row landed at the bottom edge of the viewport on a laptop.
     * Starting higher keeps the buttons comfortably above the fold.
     */
    <section className="relative bg-canvas overflow-hidden pt-6 pb-20 md:pt-8 md:pb-24">
      {/* Decorative geometry. Hidden below `lg` where it collided with the
          headline and overflowed the viewport on small screens. */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block" aria-hidden="true">
        <Squiggle className="top-[22%] left-[4%]" depth={15} />
        <PillOutline className="top-[42%] left-[-40px]" depth={10} />
        <CrossMarks className="bottom-[6%] left-[40%] text-xl" depth={6} />
      </div>

      <Shell className="relative z-10">
        {/*
          `lg:items-stretch` rather than a fixed image height. Both columns take
          the row height, so the image always finishes level with the CTA row.
          A hardcoded height had to be re-tuned per breakpoint and still left the
          buttons dangling ~50px below the image at 1024px, where the headline
          wraps to an extra line.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-center lg:items-stretch">
          <div className="relative z-10 lg:flex lg:flex-col lg:justify-center">
            {/*
              The largest step is held back to `xl`. At `lg` a 64px headline in a
              ~410px column wrapped to four lines, inflating the text column and
              unbalancing the row.
            */}
            <h1 className="text-display-sm md:text-display-md xl:text-display-lg text-ink mb-5">
              Elevate your{' '}
              {/* `text-amber` here was 1.8:1 against the canvas — a WCAG failure
                  on the largest text on the site. `gold` keeps the warm accent
                  at 4.9:1. */}
              <span className="text-gold">Vacation</span> with our Luxury Resort.
            </h1>

            <p className="text-lg text-ink-muted max-w-[500px] mb-5">
              Experience world-class hospitality:
            </p>

            <ul className="space-y-3 mb-8">
              {HIGHLIGHTS.map((highlight) => (
                <li key={highlight} className="flex items-center gap-3 text-lg text-ink">
                  <span
                    aria-hidden="true"
                    className="shrink-0 w-6 h-6 rounded-full bg-gold-soft flex items-center justify-center text-gold"
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>

            {/* Full-width and stacked on the narrowest screens, where auto-width
                buttons wrapped to two ragged lines of different widths. */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <Button size="lg" to="/destinations" className="w-full sm:w-auto">
                Book your room
              </Button>
              <Button variant="outline" size="lg" to="/deals" className="w-full sm:w-auto">
                View deals
              </Button>
            </div>
          </div>

          <div className="relative lg:flex lg:flex-col">
            <DotGrid className="-top-6 -right-6 z-0 opacity-60" columns={5} count={10} depth={6} />

            <DotGrid
              className="-left-6 top-[45%] z-20"
              columns={2}
              count={4}
              depth={-8}
              tone="amber"
              pulse
            />

            <div
              style={{ transform: `translate3d(${mouse.x * 3}px, ${mouse.y * 3}px, 0)` }}
              className="relative z-10 w-full aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[420px] rounded-lg overflow-hidden shadow-panel border-[12px] border-canvas transition-transform duration-500 ease-out"
            >
              <img
                src={heroImage}
                // Was alt="Hero Image", which describes nothing.
                alt="Sun loungers beside the resort's infinity pool at golden hour"
                width={1200}
                height={900}
                // Above the fold: load eagerly and prioritise it as the LCP element.
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                className="w-full h-full object-cover"
              />

              {/* Amber is used purely as a graphic element here — no text on it. */}
              <div
                className="absolute bottom-0 left-[-80px] w-[45%] h-6 bg-amber z-20"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 right-[-80px] w-[45%] h-6 bg-amber z-20"
                aria-hidden="true"
              />
            </div>

            <motion.div
              aria-hidden="true"
              style={{ transform: `translate3d(${mouse.x * 4}px, ${mouse.y * 4}px, 0)` }}
              className="absolute -bottom-4 -right-4 w-[50px] h-[50px] bg-ink z-0 transition-transform duration-300 ease-out"
            />
          </div>
        </div>
      </Shell>
    </section>
  );
}
