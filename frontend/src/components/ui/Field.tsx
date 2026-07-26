import { useId, forwardRef, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

const controlBase =
  'w-full bg-canvas border border-line rounded-2xl text-ink placeholder:text-ink-faint text-sm font-medium transition-colors hover:border-line-strong focus:border-gold disabled:opacity-60 disabled:cursor-not-allowed';

interface FieldShellProps {
  label: string;
  /** Wired to the control via `aria-describedby`. */
  hint?: string;
  error?: string;
  /** Rendered top-right of the label row, e.g. a "Forgot password?" link. */
  action?: ReactNode;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
}

/**
 * Owns label/control association and error wiring. Previously every form wrote
 * a bare `<label>` with no `htmlFor`, so no label was announced by a screen
 * reader and clicking a label did nothing.
 */
export function FieldShell({ label, hint, error, action, children, className }: FieldShellProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-eyebrow uppercase text-ink block">
          {label}
        </label>
        {action}
      </div>

      {children({ id, describedBy: describedBy || undefined, invalid: Boolean(error) })}

      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-subtle pl-1">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-semibold text-danger pl-1 text-pretty">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends Omit<ComponentProps<'input'>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  action?: ReactNode;
  /** Leading icon, rendered inside the control. */
  icon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, action, icon, className, containerClassName, ...props },
  ref,
) {
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      action={action}
      className={containerClassName}
    >
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          {icon && (
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-subtle"
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            className={cn(
              controlBase,
              'py-3',
              icon ? 'pl-12 pr-4' : 'px-4',
              invalid && 'border-danger',
              className,
            )}
            {...props}
          />
        </div>
      )}
    </FieldShell>
  );
});

interface PasswordInputProps extends Omit<InputProps, 'type' | 'icon'> {
  icon?: ReactNode;
}

/** Password field with an accessible show/hide toggle (was duplicated 3×). */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { label, hint, error, action, icon, className, containerClassName, ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    return (
      <FieldShell
        label={label}
        hint={hint}
        error={error}
        action={action}
        className={containerClassName}
      >
        {({ id, describedBy, invalid }) => (
          <div className="relative">
            {icon && (
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-subtle"
              >
                {icon}
              </span>
            )}
            <input
              ref={ref}
              id={id}
              type={visible ? 'text' : 'password'}
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              className={cn(
                controlBase,
                'py-3 pr-12',
                icon ? 'pl-12' : 'pl-4',
                invalid && 'border-danger',
                className,
              )}
              {...props}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? 'Hide password' : 'Show password'}
              aria-pressed={visible}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink-subtle hover:text-ink transition-colors rounded-r-2xl"
            >
              {visible ? (
                <EyeOff className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Eye className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </FieldShell>
    );
  },
);

interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, containerClassName, ...props },
  ref,
) {
  return (
    <FieldShell label={label} hint={hint} error={error} className={containerClassName}>
      {({ id, describedBy, invalid }) => (
        <textarea
          ref={ref}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            controlBase,
            'px-4 py-3 resize-y min-h-[110px]',
            invalid && 'border-danger',
            className,
          )}
          {...props}
        />
      )}
    </FieldShell>
  );
});
