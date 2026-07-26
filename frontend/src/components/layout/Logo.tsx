import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { cn } from '../../lib/utils';

/**
 * The brand lockup. There used to be three competing marks: an inline SVG in
 * the navbar reading "HOTEL.", a `Star` icon in the footer reading
 * "Luxe Reserve", and an unused `Logo.tsx` reading "StayEase".
 */
export function Logo({
  className,
  showTagline = true,
  tone = 'ink',
}: {
  className?: string;
  showTagline?: boolean;
  tone?: 'ink' | 'inverse';
}) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} — home`}
      className={cn('flex items-center gap-2.5 group', className)}
    >
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="text-amber shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <path
          d="M6 4C13 12 13 20 6 28"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 4C23 12 23 20 16 28"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="flex flex-col">
        <span
          className={cn(
            'font-display font-extrabold text-lg leading-none tracking-tight',
            tone === 'inverse' ? 'text-ink-inverse' : 'text-ink',
          )}
        >
          {site.name}
        </span>
        {showTagline && (
          // Was 8px, which is effectively unreadable.
          <span
            className={cn(
              'text-[10px] tracking-[0.18em] uppercase mt-1 leading-none',
              tone === 'inverse' ? 'text-ink-inverse/70' : 'text-ink-subtle',
            )}
          >
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
