import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Trip } from '../../types';
import {
  WEEKDAY_LABELS,
  addMonths,
  buildMonthGrid,
  isSameDay,
  isWithin,
  monthLabel,
} from '../../lib/calendar';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface TripCalendarProps {
  trips: Trip[];
}

interface TripSpan {
  trip: Trip;
  start: Date;
  end: Date;
}

/**
 * A real month calendar derived from the trips themselves.
 *
 * The version this replaces was fabricated: a hardcoded "October 2026" heading,
 * exactly 31 day cells regardless of month, four leading blanks hardcoded to
 * start at "27", arrow buttons with no handlers, and highlighting driven by
 * `startDay`/`endDay` integer columns on the trip record that only ever
 * described `upcomingTrips[0]` — every other trip was invisible.
 */
export function TripCalendar({ trips }: TripCalendarProps) {
  const spans = useMemo<TripSpan[]>(
    () =>
      trips
        .map((trip) => ({
          trip,
          start: new Date(trip.checkIn),
          end: new Date(trip.checkOut),
        }))
        .filter((span) => !Number.isNaN(span.start.getTime()) && !Number.isNaN(span.end.getTime()))
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [trips],
  );

  // Open on the month of the next trip rather than an arbitrary fixed month.
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    const upcoming = spans.find((span) => span.end >= now) ?? spans[0];
    const anchor = upcoming?.start ?? now;
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  });

  const cells = buildMonthGrid(visibleMonth);

  const spansOn = (date: Date) => spans.filter((span) => isWithin(date, span.start, span.end));

  return (
    <div className="bg-surface rounded-panel border border-line shadow-card p-5 md:p-7">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 aria-live="polite" className="text-xl text-ink">
          {monthLabel(visibleMonth)}
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
          >
            Today
          </Button>
          <button
            type="button"
            onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
            aria-label="Previous month"
            className="p-2.5 border border-line rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
            aria-label="Next month"
            className="p-2.5 border border-line rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink transition-colors"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-line border border-line rounded-xl overflow-hidden">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="bg-surface p-2.5 text-center text-[11px] font-bold text-ink-muted uppercase tracking-wider"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden" aria-hidden="true">
              {day.charAt(0)}
            </span>
            <span className="sr-only sm:hidden">{day}</span>
          </div>
        ))}

        {cells.map(({ date, inMonth, isToday }) => {
          const dayspans = spansOn(date);

          return (
            <div
              key={date.toISOString()}
              className={cn(
                'min-h-[84px] md:min-h-[110px] p-2 relative transition-colors',
                dayspans.length > 0 ? 'bg-gold-soft' : 'bg-surface',
                !inMonth && 'bg-surface-muted/60',
              )}
            >
              <span
                className={cn(
                  'ml-auto w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-medium',
                  !inMonth && 'text-ink-faint',
                  inMonth && !isToday && 'text-ink',
                  isToday && 'bg-ink text-ink-inverse font-bold',
                )}
              >
                {date.getDate()}
              </span>

              <div className="mt-1 flex flex-col gap-1">
                {dayspans.slice(0, 2).map(({ trip, start, end }) => {
                  const isStart = isSameDay(date, start);
                  const isEnd = isSameDay(date, end);

                  return (
                    <span
                      key={trip._id}
                      title={`${trip.title} — ${trip.destination}`}
                      className={cn(
                        'bg-gold text-white text-[10px] font-bold px-1.5 py-1 truncate',
                        isStart && 'rounded-l-md',
                        isEnd && 'rounded-r-md',
                        !isStart && !isEnd && 'opacity-75',
                      )}
                    >
                      {/* Only label the first day of the span; the middle days
                          read as a continuous bar. */}
                      {isStart ? trip.destination : ' '}
                      <span className="sr-only">
                        {isStart ? '' : `${trip.destination} (continued)`}
                      </span>
                    </span>
                  );
                })}

                {dayspans.length > 2 && (
                  <span className="text-[10px] font-bold text-gold-dark px-1.5">
                    +{dayspans.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
