import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { ToastContext, type Toast, type ToastTone } from './toastContext';
import { cn } from '../../../lib/utils';

const AUTO_DISMISS_MS = 5000;
/** Beyond this the stack starts covering the page rather than informing. */
const MAX_VISIBLE = 3;

const TONES: Record<ToastTone, { icon: typeof CheckCircle; className: string }> = {
  success: { icon: CheckCircle, className: 'border-success/30 text-success' },
  error: { icon: AlertTriangle, className: 'border-danger/30 text-danger' },
  info: { icon: Info, className: 'border-gold/30 text-gold-dark' },
};

/**
 * Transient feedback for actions whose result isn't obvious from the page —
 * booking confirmed, trip cancelled, stay saved. Previously every one of those
 * either said nothing or relied on an inline message the user had already
 * scrolled past.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = 'success') => {
      counter.current += 1;
      const id = `toast-${counter.current}`;

      setToasts((current) => [...current, { id, tone, message }].slice(-MAX_VISIBLE));

      timers.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      );

      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/*
        `aria-live="polite"` on a persistent region: the container must exist in
        the DOM before content is inserted, otherwise screen readers miss the
        announcement entirely. Errors get `assertive` on the item itself.
      */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-0 right-0 z-[100] flex flex-col items-end gap-3 p-4 sm:p-6 pointer-events-none"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { icon: Icon, className } = TONES[toast.tone];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                role={toast.tone === 'error' ? 'alert' : 'status'}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 w-[min(24rem,calc(100vw-2rem))] bg-surface border rounded-2xl shadow-float p-4',
                  className,
                )}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="flex-1 text-sm font-medium text-ink text-pretty">{toast.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 text-ink-subtle hover:text-ink transition-colors rounded"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
