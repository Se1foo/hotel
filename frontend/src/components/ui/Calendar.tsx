import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  WEEKDAY_LABELS,
  addMonths,
  buildMonthGrid,
  isBefore,
  isSameDay,
  isWithin,
  monthLabel,
} from '../../lib/calendar';
import { cn } from '../../lib/utils';

interface CalendarProps {
  /** The currently selected day. */
  value: Date | null;
  onSelect: (date: Date) => void;
  /** Days before this are disabled. */
  minDate?: Date;
  /** Highlights the span between the two dates, for range selection. */
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  className?: string;
}

/**
 * Month-view day picker. Replaces `@mui/x-date-pickers`' `DateCalendar`, which
 * required MUI + Emotion + a fourth theme definition for a single widget.
 */
export function Calendar({
  value,
  onSelect,
  minDate,
  rangeStart = null,
  rangeEnd = null,
  className,
}: CalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const anchor = value ?? minDate ?? new Date();
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });

  const cells = buildMonthGrid(visibleMonth);

  return (
    <div className={cn('w-[300px]', className)}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
          aria-label="Previous month"
          className="p-1.5 rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>

        <span aria-live="polite" className="text-sm font-bold text-ink">
          {monthLabel(visibleMonth)}
        </span>

        <button
          type="button"
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
          aria-label="Next month"
          className="p-1.5 rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((day) => (
          <span
            key={day}
            aria-hidden="true"
            className="text-center text-[10px] font-bold uppercase tracking-wider text-ink-subtle py-1"
          >
            {day.slice(0, 2)}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map(({ date, inMonth, isToday }) => {
          const disabled = minDate ? isBefore(date, minDate) : false;
          const selected = isSameDay(date, value);
          const inRange = isWithin(date, rangeStart, rangeEnd);
          const isEdge = isSameDay(date, rangeStart) || isSameDay(date, rangeEnd);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              aria-label={date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              aria-current={isToday ? 'date' : undefined}
              aria-pressed={selected}
              onClick={() => onSelect(date)}
              className={cn(
                'h-9 text-sm font-medium transition-colors relative',
                // Range fill sits behind the day chip so the span reads as continuous.
                inRange && !isEdge && 'bg-gold-soft',
                isSameDay(date, rangeStart) && rangeEnd && 'bg-gold-soft rounded-l-full',
                isSameDay(date, rangeEnd) && rangeStart && 'bg-gold-soft rounded-r-full',
                disabled && 'text-ink-faint/50 cursor-not-allowed',
                !disabled && !inMonth && 'text-ink-faint',
                !disabled && inMonth && 'text-ink hover:bg-surface-muted rounded-full',
              )}
            >
              <span
                className={cn(
                  'absolute inset-0 m-auto w-8 h-8 flex items-center justify-center rounded-full',
                  selected && 'bg-gold text-white font-bold',
                  !selected && isToday && inMonth && 'ring-1 ring-gold/40',
                )}
              >
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
