import { useState } from 'react';
import type { ComponentProps } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SmartImageProps extends Omit<ComponentProps<'img'>, 'onError' | 'onLoad'> {
  /** Required — every image in the app now carries real alt text. */
  alt: string;
  /** Set on above-the-fold imagery to opt out of lazy loading. */
  priority?: boolean;
  wrapperClassName?: string;
}

/**
 * All remote imagery in this project points at Unsplash and expiring
 * `lh3.googleusercontent.com` URLs, so a dead image was a broken layout with no
 * fallback. This adds a skeleton while loading, a graceful placeholder on
 * failure, and lazy loading + async decoding by default.
 */
export function SmartImage({
  alt,
  className,
  wrapperClassName,
  priority = false,
  ...props
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <span className={cn('relative block overflow-hidden bg-surface-muted', wrapperClassName)}>
      {status === 'loading' && (
        <span className="absolute inset-0 animate-pulse bg-surface-muted" aria-hidden="true" />
      )}

      {status === 'error' ? (
        <span
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-faint"
          role="img"
          aria-label={alt}
        >
          <ImageOff className="w-7 h-7" aria-hidden="true" />
          <span className="text-xs font-medium">Image unavailable</span>
        </span>
      ) : (
        <img
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...props}
        />
      )}
    </span>
  );
}
