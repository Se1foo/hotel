import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FilterPillsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Labels the group for assistive tech, e.g. "Filter deals by category". */
  label: string;
  className?: string;
}

/**
 * Accessible single-select pill group. The originals were plain buttons with no
 * grouping semantics and no indication of which option was selected beyond
 * colour alone.
 */
export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: FilterPillsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('flex flex-wrap justify-center gap-3', className)}
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <motion.button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'text-eyebrow uppercase px-6 py-3 rounded-full transition-colors',
              selected
                ? 'bg-ink text-ink-inverse shadow-card'
                : 'bg-surface border border-line text-ink hover:border-gold hover:text-gold shadow-subtle',
            )}
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}
