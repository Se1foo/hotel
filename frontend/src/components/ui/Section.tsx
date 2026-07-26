import type { ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Constrains content to the shell width with the app's standard gutters.
 * Replaces `max-w-[1280px] mx-auto px-5 md:px-[60px]` (and its three
 * near-miss variants `max-w-[1200px] px-6 md:px-12`) repeated on every page.
 */
export function Shell({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        /**
         * Gutters step up with the viewport. The content max-width (1280px) is
         * the same as a very common laptop width, so `mx-auto` contributes no
         * margin at all there — without a generous gutter the text and CTAs sit
         * hard against the window edge.
         */
        'w-full max-w-shell mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  /**
   * Section background. The home page previously alternated between `#fbf9f9`
   * and `#FAF9F6` — near-identical creams that produced visible seams.
   */
  tone?: 'canvas' | 'surface' | 'muted' | 'inverse';
  spacing?: 'sm' | 'md' | 'lg';
  /**
   * Sections clip by default so the decorative shapes that bleed past their
   * edges don't cause horizontal scroll. Set false on any section containing a
   * popover, dropdown or other floating element — clipping cut the date picker
   * off at the section boundary, leaving only its month header visible.
   */
  clip?: boolean;
}

const tones = {
  canvas: 'bg-canvas',
  surface: 'bg-surface',
  muted: 'bg-surface-muted',
  inverse: 'bg-surface-inverse text-ink-inverse',
} as const;

const spacings = { sm: 'py-14', md: 'py-20 md:py-24', lg: 'py-24 md:py-32' } as const;

export function Section({
  tone = 'canvas',
  spacing = 'md',
  clip = true,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'relative',
        clip ? 'overflow-hidden' : 'overflow-visible',
        tones[tone],
        spacings[spacing],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  /** Rendered before the accent. */
  title: string;
  /** Emphasised in gold, appended to the title. */
  accent?: string;
  eyebrow?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
  children?: ReactNode;
}

/**
 * The `Title <span className="text-gold">Accent</span>` + subtitle lockup that
 * appeared, copy-pasted with different pixel sizes, on six separate pages.
 */
export function SectionHeading({
  title,
  accent,
  eyebrow,
  subtitle,
  align = 'left',
  as: Tag = 'h2',
  className,
  children,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(centered && 'text-center mx-auto', className)}
    >
      {eyebrow && (
        <p className={cn('text-eyebrow uppercase text-gold mb-4', centered && 'mx-auto')}>{eyebrow}</p>
      )}

      <Tag
        className={cn(
          'text-ink',
          Tag === 'h1'
            ? 'text-display-sm md:text-display-md lg:text-display-lg'
            : 'text-display-sm md:text-display-md',
        )}
      >
        {title}
        {accent && <span className="text-gold"> {accent}</span>}
      </Tag>

      {subtitle && (
        <p
          className={cn(
            'text-ink-muted text-lg mt-5 max-w-2xl text-pretty',
            centered && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}

      {children}
    </motion.div>
  );
}
