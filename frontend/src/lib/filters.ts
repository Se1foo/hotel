import type { Destination } from '../types';
import { parseCapacity } from './format';

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Top rated' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['value'];

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value) as readonly string[];

export interface SearchCriteria {
  location: string;
  guests: number;
  /** `yyyy-MM-dd`. Carried through to the booking form, not used as a filter. */
  checkIn: string;
  checkOut: string;
  minPrice: number | null;
  maxPrice: number | null;
  /** Any-of match against `tags`. */
  tags: string[];
  sort: SortOption;
  dealsOnly: boolean;
}

export const EMPTY_CRITERIA: SearchCriteria = {
  location: '',
  guests: 1,
  checkIn: '',
  checkOut: '',
  minPrice: null,
  maxPrice: null,
  tags: [],
  sort: 'recommended',
  dealsOnly: false,
};

const readNumber = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

/** The URL is the source of truth, so filters survive refresh and are shareable. */
export function readCriteria(params: URLSearchParams): SearchCriteria {
  const guests = Number(params.get('guests'));
  const sort = params.get('sort');

  return {
    location: params.get('location')?.trim() ?? '',
    guests: Number.isFinite(guests) && guests > 0 ? guests : EMPTY_CRITERIA.guests,
    checkIn: params.get('checkIn') ?? '',
    checkOut: params.get('checkOut') ?? '',
    minPrice: readNumber(params.get('minPrice')),
    maxPrice: readNumber(params.get('maxPrice')),
    tags: params.getAll('tag').filter(Boolean),
    sort: sort && SORT_VALUES.includes(sort) ? (sort as SortOption) : 'recommended',
    dealsOnly: params.get('deals') === '1',
  };
}

export function writeCriteria(criteria: SearchCriteria): URLSearchParams {
  const params = new URLSearchParams();
  if (criteria.location) params.set('location', criteria.location);
  if (criteria.checkIn) params.set('checkIn', criteria.checkIn);
  if (criteria.checkOut) params.set('checkOut', criteria.checkOut);
  if (criteria.guests > 1) params.set('guests', String(criteria.guests));
  if (criteria.minPrice !== null) params.set('minPrice', String(criteria.minPrice));
  if (criteria.maxPrice !== null) params.set('maxPrice', String(criteria.maxPrice));
  criteria.tags.forEach((tag) => params.append('tag', tag));
  if (criteria.sort !== 'recommended') params.set('sort', criteria.sort);
  if (criteria.dealsOnly) params.set('deals', '1');
  return params;
}

/** True when anything narrows the default view. */
export function hasActiveFilters(criteria: SearchCriteria): boolean {
  return (
    criteria.location !== '' ||
    criteria.guests > EMPTY_CRITERIA.guests ||
    criteria.minPrice !== null ||
    criteria.maxPrice !== null ||
    criteria.tags.length > 0 ||
    criteria.dealsOnly ||
    criteria.checkIn !== '' ||
    criteria.checkOut !== ''
  );
}

/** Number of narrowing filters, for the "Filters (3)" badge. */
export function countActiveFilters(criteria: SearchCriteria): number {
  let count = 0;
  if (criteria.location) count += 1;
  if (criteria.guests > EMPTY_CRITERIA.guests) count += 1;
  if (criteria.minPrice !== null || criteria.maxPrice !== null) count += 1;
  if (criteria.dealsOnly) count += 1;
  count += criteria.tags.length;
  return count;
}

/**
 * Filters on the fields the API actually exposes: free-text location/title
 * match, guest capacity, price bounds, tags and the deal flag.
 *
 * Note on dates: `Destination` carries no availability calendar, so `checkIn` /
 * `checkOut` cannot be filtered on truthfully. The original implementation
 * accepted both parameters and silently discarded them, so the date pickers
 * appeared to filter and did nothing. They now travel with the search and
 * prefill the booking form instead.
 */
export function filterDestinations(
  rooms: Destination[],
  criteria: SearchCriteria,
): Destination[] {
  const needle = criteria.location.toLowerCase();

  const filtered = rooms.filter((room) => {
    if (needle) {
      const haystack = `${room.location} ${room.title} ${room.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }

    if (criteria.guests > 0 && parseCapacity(room.capacity) < criteria.guests) return false;
    if (criteria.minPrice !== null && room.price < criteria.minPrice) return false;
    if (criteria.maxPrice !== null && room.price > criteria.maxPrice) return false;
    if (criteria.dealsOnly && !room.isDeal) return false;

    // Any-of, not all-of: selecting "Spa" and "Ski" should widen, not narrow.
    if (criteria.tags.length > 0 && !criteria.tags.some((tag) => room.tags.includes(tag))) {
      return false;
    }

    return true;
  });

  return sortDestinations(filtered, criteria.sort);
}

export function sortDestinations(rooms: Destination[], sort: SortOption): Destination[] {
  // Copied before sorting — `Array.prototype.sort` mutates, and this array can
  // be React Query's cached data.
  const sorted = [...rooms];

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      // Reviewed properties outrank unreviewed ones at the same score.
      return sorted.sort((a, b) => b.rating - a.rating || b.reviews.length - a.reviews.length);
    case 'recommended':
    default:
      // Deals first, then rating, then the catalogue's own order.
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.isDeal)) - Number(Boolean(a.isDeal)) ||
          b.rating - a.rating ||
          a.id - b.id,
      );
  }
}

/**
 * Tag vocabulary derived from the data, so it can never list a filter that
 * matches nothing.
 *
 * Ordered by how many stays carry each tag, then alphabetically. Twelve
 * properties generate ~27 distinct tags; showing them alphabetically buried the
 * useful ones ("Ocean View", "Ski Resort") among one-offs, so the caller can
 * take the first N and get the most broadly useful filters.
 */
export function collectTags(rooms: Destination[]): string[] {
  const counts = new Map<string, number>();
  rooms.forEach((room) =>
    room.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)),
  );

  return Array.from(counts.entries())
    .sort(([tagA, countA], [tagB, countB]) => countB - countA || tagA.localeCompare(tagB))
    .map(([tag]) => tag);
}

export function priceBounds(rooms: Destination[]): { min: number; max: number } {
  if (rooms.length === 0) return { min: 0, max: 0 };
  const prices = rooms.map((room) => room.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
