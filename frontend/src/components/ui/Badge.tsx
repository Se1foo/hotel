import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-[0.12em] whitespace-nowrap',
  {
    variants: {
      tone: {
        ink: 'bg-ink text-ink-inverse shadow-subtle',
        gold: 'bg-gold text-white shadow-subtle',
        light: 'bg-surface/95 text-ink shadow-subtle backdrop-blur-sm',
        outline: 'bg-canvas border border-line text-ink-muted',
        soft: 'bg-gold-soft text-gold-dark',
      },
      size: {
        sm: 'text-[10px] px-2.5 py-1',
        md: 'text-[11px] px-3 py-1.5',
        lg: 'text-xs px-4 py-2',
      },
    },
    defaultVariants: { tone: 'ink', size: 'md' },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

/** The pill label used for deal tags, statuses and amenity chips. */
export function Badge({ tone, size, className, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)}>{children}</span>;
}
