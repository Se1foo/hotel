import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  accent: string;
  subtitle: string;
  children: ReactNode;
  footer: { prompt: string; linkLabel: string; to: string };
}

/**
 * Shared chrome for Login and SignUp, which were previously ~90% identical:
 * the same card, heading lockup, alerts, divider, Google button, spinner SVG and
 * footer link were copy-pasted into both files.
 */
export function AuthCard({ title, accent, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-5 py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-surface rounded-panel shadow-panel border border-line p-8 md:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl text-ink">
            {title} <span className="text-gold">{accent}</span>
          </h1>
          <p className="text-ink-muted text-sm mt-2.5 text-pretty">{subtitle}</p>
        </div>

        {children}

        <p className="text-center mt-7 text-sm text-ink-muted">
          {footer.prompt}{' '}
          <Link to={footer.to} className="text-gold hover:text-gold-dark font-bold">
            {footer.linkLabel}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
