import { describe, expect, it } from 'vitest';
import {
  EMPTY_CRITERIA,
  collectTags,
  countActiveFilters,
  filterDestinations,
  hasActiveFilters,
  priceBounds,
  readCriteria,
  sortDestinations,
  writeCriteria,
  type SearchCriteria,
} from './filters';
import type { Destination } from '../types';

const destination = (over: Partial<Destination>): Destination => ({
  id: 1,
  title: 'Test Stay',
  location: 'Testville',
  country: 'GB',
  description: 'A place.',
  beds: '1 King',
  capacity: 'Up to 2',
  amenities: ['Free Wi-Fi'],
  price: 500,
  rating: 4.5,
  reviews: [],
  image: 'https://example.com/a.jpg',
  images: ['https://example.com/a.jpg'],
  tags: ['Luxury'],
  ...over,
});

const criteria = (over: Partial<SearchCriteria> = {}): SearchCriteria => ({
  ...EMPTY_CRITERIA,
  ...over,
});

const CATALOGUE: Destination[] = [
  destination({ id: 1, title: 'Bali Villa', location: 'Ubud, Bali', price: 1250, rating: 4.9, capacity: 'Up to 2', tags: ['Luxury', 'Jungle'], isDeal: true, originalPrice: 1800 }),
  destination({ id: 2, title: 'Kyoto Pavilion', location: 'Higashiyama, Kyoto', price: 540, rating: 4.9, capacity: 'Up to 4', tags: ['Cultural'] }),
  destination({ id: 3, title: 'Aspen Lodge', location: 'Aspen, Colorado', price: 890, rating: 4.7, capacity: 'Up to 6', tags: ['Ski Resort', 'Family Friendly'], isDeal: true }),
  destination({ id: 4, title: 'Riad Marrakech', location: 'Medina, Marrakech', price: 320, rating: 4.8, capacity: 'Up to 2', tags: ['Cultural', 'Boutique'] }),
];

describe('filterDestinations', () => {
  it('returns everything when nothing is narrowed', () => {
    expect(filterDestinations(CATALOGUE, criteria())).toHaveLength(4);
  });

  it('matches location case-insensitively', () => {
    const result = filterDestinations(CATALOGUE, criteria({ location: 'kyoto' }));
    expect(result.map((r) => r.id)).toEqual([2]);
  });

  it('also matches against the title and tags, not just the location', () => {
    expect(filterDestinations(CATALOGUE, criteria({ location: 'riad' })).map((r) => r.id)).toEqual([4]);
    expect(filterDestinations(CATALOGUE, criteria({ location: 'ski' })).map((r) => r.id)).toEqual([3]);
  });

  it('excludes stays that cannot hold the party size', () => {
    const result = filterDestinations(CATALOGUE, criteria({ guests: 5 }));
    expect(result.map((r) => r.id)).toEqual([3]);
  });

  it('applies price bounds inclusively', () => {
    const result = filterDestinations(CATALOGUE, criteria({ minPrice: 320, maxPrice: 890 }));
    expect(result.map((r) => r.id).sort()).toEqual([2, 3, 4]);
  });

  it('filters to deals only', () => {
    const result = filterDestinations(CATALOGUE, criteria({ dealsOnly: true }));
    expect(result.map((r) => r.id).sort()).toEqual([1, 3]);
  });

  it('treats multiple tags as ANY-of, so selecting more widens the result', () => {
    const one = filterDestinations(CATALOGUE, criteria({ tags: ['Cultural'] }));
    const two = filterDestinations(CATALOGUE, criteria({ tags: ['Cultural', 'Ski Resort'] }));
    expect(one).toHaveLength(2);
    expect(two.length).toBeGreaterThan(one.length);
  });

  it('combines independent filters conjunctively', () => {
    const result = filterDestinations(
      CATALOGUE,
      criteria({ tags: ['Cultural'], maxPrice: 400 }),
    );
    expect(result.map((r) => r.id)).toEqual([4]);
  });

  it('ignores check-in and check-out, which are not filterable without availability data', () => {
    const withDates = filterDestinations(
      CATALOGUE,
      criteria({ checkIn: '2026-09-10', checkOut: '2026-09-14' }),
    );
    expect(withDates).toHaveLength(4);
  });

  it('does not mutate the input array', () => {
    const input = [...CATALOGUE];
    const order = input.map((r) => r.id);
    filterDestinations(input, criteria({ sort: 'price-asc' }));
    expect(input.map((r) => r.id)).toEqual(order);
  });
});

describe('sortDestinations', () => {
  it('sorts by price ascending and descending', () => {
    expect(sortDestinations(CATALOGUE, 'price-asc').map((r) => r.price)).toEqual([320, 540, 890, 1250]);
    expect(sortDestinations(CATALOGUE, 'price-desc').map((r) => r.price)).toEqual([1250, 890, 540, 320]);
  });

  it('breaks a rating tie using the review count', () => {
    const tied = [
      destination({ id: 10, rating: 4.9, reviews: [] }),
      destination({
        id: 11,
        rating: 4.9,
        reviews: [{ userId: 'u', authorName: 'A', rating: 5, createdAt: '2026-01-01' }],
      }),
    ];
    expect(sortDestinations(tied, 'rating-desc').map((r) => r.id)).toEqual([11, 10]);
  });

  it('puts deals first under the recommended ordering', () => {
    const ids = sortDestinations(CATALOGUE, 'recommended').map((r) => r.id);
    expect(ids.slice(0, 2).sort()).toEqual([1, 3]);
  });

  it('does not mutate its input', () => {
    const input = [...CATALOGUE];
    sortDestinations(input, 'price-desc');
    expect(input.map((r) => r.id)).toEqual([1, 2, 3, 4]);
  });
});

describe('URL criteria round-tripping', () => {
  it('survives a write/read cycle', () => {
    const original = criteria({
      location: 'Kyoto',
      guests: 4,
      checkIn: '2026-09-10',
      checkOut: '2026-09-14',
      minPrice: 200,
      maxPrice: 900,
      tags: ['Cultural', 'Boutique'],
      sort: 'price-asc',
      dealsOnly: true,
    });
    expect(readCriteria(writeCriteria(original))).toEqual(original);
  });

  it('omits defaults from the URL to keep it short and shareable', () => {
    expect(writeCriteria(EMPTY_CRITERIA).toString()).toBe('');
  });

  it('falls back to defaults for junk input rather than throwing', () => {
    const parsed = readCriteria(
      new URLSearchParams('guests=abc&minPrice=-5&sort=explode&deals=maybe'),
    );
    expect(parsed.guests).toBe(EMPTY_CRITERIA.guests);
    expect(parsed.minPrice).toBeNull();
    expect(parsed.sort).toBe('recommended');
    expect(parsed.dealsOnly).toBe(false);
  });
});

describe('active filter reporting', () => {
  it('reports no active filters for the default criteria', () => {
    expect(hasActiveFilters(EMPTY_CRITERIA)).toBe(false);
    expect(countActiveFilters(EMPTY_CRITERIA)).toBe(0);
  });

  it('counts a price range as one filter, not two', () => {
    expect(countActiveFilters(criteria({ minPrice: 100, maxPrice: 900 }))).toBe(1);
  });

  it('counts each tag separately', () => {
    expect(countActiveFilters(criteria({ tags: ['A', 'B', 'C'] }))).toBe(3);
  });
});

describe('collectTags and priceBounds', () => {
  it('orders tags by how many stays carry them, then alphabetically', () => {
    // "Cultural" appears twice; everything else once. Frequency-first ordering
    // keeps broadly-useful filters visible when the list is truncated.
    expect(collectTags(CATALOGUE)).toEqual([
      'Cultural',
      'Boutique',
      'Family Friendly',
      'Jungle',
      'Luxury',
      'Ski Resort',
    ]);
  });

  it('de-duplicates tags shared across stays', () => {
    const tags = collectTags(CATALOGUE);
    expect(new Set(tags).size).toBe(tags.length);
  });

  it('reports the price range of the catalogue', () => {
    expect(priceBounds(CATALOGUE)).toEqual({ min: 320, max: 1250 });
  });

  it('does not blow up on an empty catalogue', () => {
    expect(collectTags([])).toEqual([]);
    expect(priceBounds([])).toEqual({ min: 0, max: 0 });
  });
});
