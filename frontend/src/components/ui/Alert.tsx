import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

const tones = {
  error: {
    icon: AlertTriangle,
    className: 'bg-danger-soft border-danger/25 text-danger',
    role: 'alert' as const,
  },
  success: {
    icon: CheckCircle,
    className: 'bg-success-soft border-success/25 text-success',
    role: 'status' as const,
  },
  info: {
    icon: Info,
    className: 'bg-gold-soft border-gold/25 text-gold-dark',
    role: 'status' as const,
  },
};

interface AlertProps {
  tone?: keyof typeof tones;
  children: ReactNode;
  className?: string;
}

/** Shared error/success banner — was duplicated across Login, SignUp and booking. */
export function Alert({ tone = 'error', children, className }: AlertProps) {
  const { icon: Icon, className: toneClass, role } = tones[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role={role}
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 text-sm font-medium',
        toneClass,
        className,
      )}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
      <span className="text-pretty">{children}</span>
    </motion.div>
  );
}
