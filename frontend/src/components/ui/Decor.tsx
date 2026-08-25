import { motion } from 'framer-motion';
import { useMousePosition } from '../../lib/useMousePosition';
import { cn } from '../../lib/utils';

/**
 * The hero's decorative geometry — squiggles, dot grids and "x" marks — was
 * copy-pasted across four sections with slightly different colours and
 * hardcoded parallax multipliers. These share one implementation and one
 * mouse-position subscription per consumer.
 */

interface DecorProps {
  className?: string;
  /** Parallax strength in px. 0 disables it. */
  depth?: number;
  tone?: 'line' | 'amber' | 'ink';
}

const tones = {
  line: 'text-line-strong',
  amber: 'text-amber',
  ink: 'text-ink-faint',
} as const;

/** Shared parallax transform. Returns a static transform when depth is 0. */
function useParallax(depth: number) {
  const mouse = useMousePosition();
  if (!depth) return undefined;
  return { transform: `translate3d(${mouse.x * depth}px, ${mouse.y * depth}px, 0)` };
}

export function Squiggle({ className, depth = 0, tone = 'line' }: DecorProps) {
  const style = useParallax(depth);
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn('absolute transition-transform duration-500 ease-out', className)}
    >
      <svg
        className={cn('w-24 h-16', tones[tone])}
        viewBox="0 0 100 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10,25 Q20,10 35,30 T60,20 T80,40 T95,15" />
      </svg>
    </div>
  );
}

export function PillOutline({ className, depth = 0 }: DecorProps) {
  const style = useParallax(depth);
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        'absolute w-24 h-9 border-2 border-line-strong rounded-full transition-transform duration-500 ease-out',
        className,
      )}
    />
  );
}

/**
 * Two small crosses.
 *
 * These used to be literal `<span>x</span>` text. Set in the body font at 2xl
 * they rendered as a lowercase letter, so next to real copy they read as a
 * stray typo rather than as ornament — it showed up in every screenshot of the
 * landing page. Drawn as strokes instead, sized in `em` so the existing
 * `text-xl` / `text-2xl` call sites still control them.
 */
export function CrossMarks({ className, depth = 0 }: DecorProps) {
  const style = useParallax(depth);
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        'absolute flex gap-4 text-ink-faint text-2xl select-none transition-transform duration-500 ease-out',
        className,
      )}
    >
      <Cross />
      <Cross />
    </div>
  );
}

function Cross() {
  return (
    <svg
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      aria-hidden="true"
      className="h-[0.62em] w-[0.62em]"
    >
      <path d="M1.5 1.5 8.5 8.5M8.5 1.5 1.5 8.5" />
    </svg>
  );
}

interface DotGridProps extends DecorProps {
  columns: number;
  count: number;
  /** Adds a staggered pulse. Suppressed automatically by prefers-reduced-motion. */
  pulse?: boolean;
  dotClassName?: string;
}

export function DotGrid({
  className,
  depth = 0,
  columns,
  count,
  pulse = false,
  tone = 'ink',
  dotClassName,
}: DotGridProps) {
  const style = useParallax(depth);
  const dotTone = tone === 'amber' ? 'bg-amber' : 'bg-ink/30';

  return (
    <div
      aria-hidden="true"
      style={{ ...style, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      className={cn('absolute grid gap-2 transition-transform duration-500 ease-out', className)}
    >
      {Array.from({ length: count }, (_, i) =>
        pulse ? (
          <motion.span
            key={i}
            className={cn('rounded-full w-3.5 h-3.5 shadow-subtle', dotTone, dotClassName)}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ) : (
          <span key={i} className={cn('rounded-full w-1.5 h-1.5', dotTone, dotClassName)} />
        ),
      )}
    </div>
  );
}
