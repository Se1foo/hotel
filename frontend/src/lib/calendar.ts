/**
 * Month-grid maths shared by the booking date picker and the trips calendar.
 *
 * The trips calendar was previously hardcoded: a fixed "October 2026" heading,
 * exactly 31 day cells, four leading blanks starting at 27, and non-functional
 * arrow buttons. This computes real grids for any month.
 */

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export interface CalendarCell {
  date: Date;
  /** False for the leading/trailing days that pad the grid to whole weeks. */
  inMonth: boolean;
  isToday: boolean;
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const isSameDay = (a: Date | null, b: Date | null): boolean =>
  Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());

export const addMonths = (date: Date, delta: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + delta, 1);

export const addDays = (date: Date, delta: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);

export const monthLabel = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

/** True when `date` falls in [start, end], comparing whole days only. */
export const isWithin = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const time = startOfDay(date).getTime();
  return time >= startOfDay(start).getTime() && time <= startOfDay(end).getTime();
};

export const isBefore = (date: Date, other: Date): boolean =>
  startOfDay(date).getTime() < startOfDay(other).getTime();

/**
 * Builds a 6-week (42 cell) grid so the calendar never changes height between
 * months — a shorter grid causes the surrounding layout to jump.
 */
export function buildMonthGrid(month: Date): CalendarCell[] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const today = startOfDay(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      date,
      inMonth: date.getMonth() === month.getMonth(),
      isToday: isSameDay(date, today),
    };
  });
}
