import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends ComponentProps<'div'> {
  /** Adds a hover lift. Only use on cards that are actually clickable. */
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
} as const;

/**
 * The standard white panel: replaces the hand-written
 * `bg-white rounded-3xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.03)] border border-[#F0F0F0]`
 * that appeared (with four slightly different shadow values) on every page.
 */
export function Card({
  className,
  interactive,
  padding = 'none',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-line rounded-panel shadow-card',
        interactive &&
          'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 focus-within:shadow-card-hover',
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
