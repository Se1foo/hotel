import type { ReactNode } from 'react';
import { AlertCircle, SearchX } from 'lucide-react';
import { Spinner } from './Spinner';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface StateShellProps {
  className?: string;
  children: ReactNode;
}

function StateShell({ className, children }: StateShellProps) {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center py-20 px-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Consistent loading state — replaces five differently-styled ad-hoc spinners. */
export function LoadingState({ message = 'Loading…', className }: { message?: string; className?: string }) {
  return (
    <StateShell className={className}>
      <Spinner size="lg" label={null} className="mb-5" />
      <p role="status" className="text-eyebrow uppercase text-ink-muted">
        {message}
      </p>
    </StateShell>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <StateShell className={className}>
      <AlertCircle className="w-12 h-12 text-danger mb-5" aria-hidden="true" />
      <h2 className="text-2xl text-ink mb-2">{title}</h2>
      {message && <p className="text-ink-muted max-w-md text-pretty mb-6">{message}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </StateShell>
  );
}

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Was missing entirely — "My Trips" rendered a blank page with no trips, and
 * filtering Deals down to zero results showed an empty grid.
 */
export function EmptyState({ title, message, icon, action, className }: EmptyStateProps) {
  return (
    <StateShell className={className}>
      <div className="w-16 h-16 rounded-full bg-surface-muted border border-line flex items-center justify-center text-ink-subtle mb-6">
        {icon ?? <SearchX className="w-7 h-7" aria-hidden="true" />}
      </div>
      <h2 className="text-2xl text-ink mb-2">{title}</h2>
      {message && <p className="text-ink-muted max-w-md text-pretty mb-6">{message}</p>}
      {action}
    </StateShell>
  );
}
