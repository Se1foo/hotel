import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from 'react-router-dom';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Spinner } from './Spinner';

/**
 * The one button in the app. Replaces ~15 hand-copied variations of
 * `bg-[#1A1A1A] ... hover:bg-[#8B6B10] ... rounded-full`.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        /** Dark charcoal pill that warms to gold on hover — the primary CTA. */
        primary: 'bg-ink text-ink-inverse hover:bg-gold shadow-subtle hover:shadow-card',
        /** Inverse of primary, for use on dark or photographic backgrounds. */
        inverse: 'bg-surface text-ink hover:text-gold shadow-float',
        outline: 'bg-surface text-ink border border-line-strong hover:border-gold hover:text-gold',
        ghost: 'text-ink-muted hover:text-ink hover:bg-surface-muted',
        link: 'text-gold hover:text-gold-dark underline-offset-4 hover:underline p-0',
        danger: 'bg-danger text-white hover:bg-danger/90',
      },
      size: {
        sm: 'text-sm px-4 py-2',
        md: 'text-sm px-6 py-3',
        lg: 'text-base px-8 py-4',
        icon: 'p-3',
      },
      shape: {
        pill: 'rounded-full',
        rounded: 'rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', shape: 'pill' },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface CommonProps extends ButtonVariants {
  className?: string;
  children?: ReactNode;
  /** Shows a spinner and blocks interaction. */
  isLoading?: boolean;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<'button'>, keyof CommonProps> & { to?: undefined; href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & { to: string };

type ButtonAsAnchor = CommonProps &
  Omit<ComponentProps<'a'>, keyof CommonProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

/**
 * Renders a `<button>`, a router `<Link>` (pass `to`) or an `<a>` (pass `href`)
 * so navigation actions stay real links — keyboard- and middle-click-friendly.
 */
export function Button({
  className,
  variant,
  size,
  shape,
  fullWidth,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, shape, fullWidth }), className);

  if ('to' in props && props.to !== undefined) {
    const { to, ...rest } = props as ButtonAsLink;
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsAnchor;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const { disabled, type = 'button', ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} disabled={disabled || isLoading} {...rest}>
      {isLoading ? <Spinner size="sm" tone="current" label="Working" /> : children}
    </button>
  );
}
