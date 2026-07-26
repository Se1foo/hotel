import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  buildMonthGrid,
  isBefore,
  isSameDay,
  isWithin,
  monthLabel,
} from './calendar';

/**
 * The trips calendar was previously hardcoded to "October 2026" with 31 fixed
 * cells and four leading blanks starting at 27. These tests pin the real grid
 * maths, including the month-boundary and leap-year cases that hand-written
 * calendars always get wrong.
 */
describe('buildMonthGrid', () => {
  it('always returns six whole weeks so the layout cannot jump between months', () => {
    for (const month of [new Date(2026, 0, 1), new Date(2026, 1, 1), new Date(2026, 7, 1)]) {
      expect(buildMonthGrid(month)).toHaveLength(42);
    }
  });

  it('starts on a Sunday regardless of where the month begins', () => {
    // 1 Sep 2026 is a Tuesday, so the grid must back up to Sunday 30 August.
    const grid = buildMonthGrid(new Date(2026, 8, 1));
    expect(grid[0].date.getDay()).toBe(0);
    expect(grid[0].inMonth).toBe(false);
    expect(grid[0].date.getDate()).toBe(30);
    expect(grid[0].date.getMonth()).toBe(7);
  });

  it('flags exactly the days belonging to the target month', () => {
    const grid = buildMonthGrid(new Date(2026, 3, 1)); // April, 30 days
    expect(grid.filter((cell) => cell.inMonth)).toHaveLength(30);
  });

  it('handles a leap-year February', () => {
    const grid = buildMonthGrid(new Date(2024, 1, 1));
    const inMonth = grid.filter((cell) => cell.inMonth);
    expect(inMonth).toHaveLength(29);
    expect(inMonth.at(-1)?.date.getDate()).toBe(29);
  });

  it('handles a non-leap February', () => {
    expect(buildMonthGrid(new Date(2026, 1, 1)).filter((c) => c.inMonth)).toHaveLength(28);
  });
});

describe('addMonths', () => {
  it('rolls forward across a year boundary', () => {
    const result = addMonths(new Date(2026, 11, 1), 1);
    expect(result.getFullYear()).toBe(2027);
    expect(result.getMonth()).toBe(0);
  });

  it('rolls backward across a year boundary', () => {
    const result = addMonths(new Date(2026, 0, 1), -1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11);
  });

  it('does not overflow when the source day exceeds the target month length', () => {
    // Normalised to the first of the month, so 31 Jan + 1 cannot become 3 March.
    const result = addMonths(new Date(2026, 0, 31), 1);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(1);
  });
});

describe('addDays', () => {
  it('crosses month boundaries', () => {
    const result = addDays(new Date(2026, 0, 30), 3);
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(2);
  });
});

describe('isSameDay', () => {
  it('ignores the time component', () => {
    expect(isSameDay(new Date(2026, 5, 10, 23, 59), new Date(2026, 5, 10, 0, 1))).toBe(true);
  });

  it('distinguishes the same day-of-month in different months', () => {
    expect(isSameDay(new Date(2026, 5, 10), new Date(2026, 6, 10))).toBe(false);
  });

  it('is false when either side is null', () => {
    expect(isSameDay(null, new Date())).toBe(false);
    expect(isSameDay(new Date(), null)).toBe(false);
    expect(isSameDay(null, null)).toBe(false);
  });
});

describe('isWithin', () => {
  const start = new Date(2026, 8, 10);
  const end = new Date(2026, 8, 14);

  it('includes both endpoints', () => {
    expect(isWithin(start, start, end)).toBe(true);
    expect(isWithin(end, start, end)).toBe(true);
  });

  it('includes interior days and excludes exterior ones', () => {
    expect(isWithin(new Date(2026, 8, 12), start, end)).toBe(true);
    expect(isWithin(new Date(2026, 8, 9), start, end)).toBe(false);
    expect(isWithin(new Date(2026, 8, 15), start, end)).toBe(false);
  });

  it('compares whole days, so a late-evening timestamp still counts', () => {
    expect(isWithin(new Date(2026, 8, 14, 23, 30), start, end)).toBe(true);
  });

  it('is false for an incomplete range', () => {
    expect(isWithin(start, start, null)).toBe(false);
    expect(isWithin(start, null, end)).toBe(false);
  });
});

describe('isBefore', () => {
  it('compares by day, not by timestamp', () => {
    // Same calendar day, earlier clock time — must not count as "before".
    expect(isBefore(new Date(2026, 5, 10, 1), new Date(2026, 5, 10, 23))).toBe(false);
    expect(isBefore(new Date(2026, 5, 9, 23), new Date(2026, 5, 10, 1))).toBe(true);
  });
});

describe('monthLabel', () => {
  it('renders a full month and year', () => {
    expect(monthLabel(new Date(2026, 9, 1))).toBe('October 2026');
  });
});
