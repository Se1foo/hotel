/**
 * Shared formatters. Previously every component hand-rolled
 * `${price.toLocaleString()}` and rendered raw ISO date strings straight from
 * the API (so "My Trips" showed `2026-07-25T12:33:00.000Z` next to a clock icon).
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number): string => currencyFormatter.format(value);

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/**
 * Accepts an ISO string, a `yyyy-MM-dd` string, or a pre-formatted human string.
 * Trip records seeded before dates were normalised store values like
 * "Oct 12, 2026", so anything unparseable is passed through untouched rather
 * than rendered as "Invalid Date".
 */
export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return dateFormatter.format(date);
};

/** Inclusive-of-check-in, exclusive-of-check-out night count. */
export const countNights = (checkIn: string | Date, checkOut: string | Date): number => {
  const start = checkIn instanceof Date ? checkIn : new Date(checkIn);
  const end = checkOut instanceof Date ? checkOut : new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
};

/** `yyyy-MM-dd` in **local** time — `toISOString()` shifts the day near midnight. */
export const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Parses `yyyy-MM-dd` as a local date (`new Date('2026-01-01')` is UTC midnight). */
export const fromDateInputValue = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
};

/** Pulls the first integer out of capacity strings like "Up to 4". */
export const parseCapacity = (capacity: string): number => {
  const match = /\d+/.exec(capacity);
  return match ? Number(match[0]) : 0;
};

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;
