import { cn } from '../../lib/utils';

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
} as const;

const tones = {
  gold: 'border-gold border-t-transparent',
  ink: 'border-ink border-t-transparent',
  current: 'border-current border-t-transparent',
} as const;

interface SpinnerProps {
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
  className?: string;
  /** Announced to screen readers. Set to `null` when a parent already labels it. */
  label?: string | null;
}

/** Replaces five bespoke spinner implementations (three CSS, two inline SVG). */
export function Spinner({ size = 'md', tone = 'gold', className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label ?? undefined}
      className={cn('inline-block rounded-full animate-spin', sizes[size], tones[tone], className)}
    />
  );
}
