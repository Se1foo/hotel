import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Horizontal anchoring relative to the trigger wrapper. */
  align?: 'start' | 'end';
}

/**
 * Minimal anchored popover with click-outside and Escape handling — replaces
 * MUI's `Popover` (which dragged in `@mui/material` and `@emotion/*` purely for
 * the destinations search bar).
 *
 * Render inside a `relative` wrapper alongside the trigger.
 */
export function Popover({ open, onClose, children, className, align = 'start' }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const node = ref.current;
      // The trigger lives in the parent wrapper, so ignore clicks inside it to
      // avoid immediately reopening on the same press.
      if (node && !node.parentElement?.contains(event.target as Node)) onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            'absolute top-[calc(100%+8px)] z-50 bg-surface border border-line rounded-panel shadow-float p-4',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
