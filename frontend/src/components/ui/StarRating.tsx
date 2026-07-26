import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StarRatingProps {
  /** The currently saved rating. */
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Omit to render a read-only display. */
  onRate?: (rating: number) => void;
  disabled?: boolean;
  className?: string;
  /** Describes what is being rated, e.g. "Zermatt Lodge". */
  label?: string;
}

const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' } as const;

/**
 * The old inline widget only ever filled stars from `hoverRating`, so a user's
 * saved rating was invisible and every star reset to grey after saving. This
 * renders `value` as the resting state and uses hover purely as a preview.
 */
export function StarRating({
  value,
  max = 5,
  size = 'md',
  onRate,
  disabled = false,
  className,
  label,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const interactive = Boolean(onRate) && !disabled;
  const shown = hovered || value;

  if (!onRate) {
    return (
      <span
        className={cn('inline-flex items-center gap-0.5', className)}
        role="img"
        aria-label={`Rated ${value} out of ${max}`}
      >
        {Array.from({ length: max }, (_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(
              sizes[size],
              i < Math.round(value) ? 'fill-star text-star' : 'text-line-strong',
            )}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      role="radiogroup"
      aria-label={label ? `Rate ${label}` : 'Rate this destination'}
      onMouseLeave={() => setHovered(0)}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} of ${max} stars`}
            disabled={!interactive}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            onClick={() => onRate?.(star)}
            className={cn(
              'rounded p-0.5 transition-transform',
              interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-60',
            )}
          >
            <Star
              aria-hidden="true"
              className={cn(
                sizes[size],
                'transition-colors',
                star <= shown ? 'fill-star text-star' : 'text-line-strong',
              )}
            />
          </button>
        );
      })}
    </span>
  );
}
