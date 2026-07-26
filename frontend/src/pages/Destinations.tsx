import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDestinations } from '../lib/api';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  collectTags,
  countActiveFilters,
  filterDestinations,
  priceBounds,
  readCriteria,
  writeCriteria,
  type SearchCriteria,
} from '../lib/filters';
import { Section, SectionHeading, Shell } from '../components/ui/Section';
import { SearchBar } from '../components/destinations/SearchBar';
import { FilterPanel } from '../components/destinations/FilterPanel';
import { RoomGrid } from '../components/ui/RoomGrid';
import { Button } from '../components/ui/Button';

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  /** The URL is the single source of truth, so filtered views are shareable. */
  const applied = useMemo(() => readCriteria(searchParams), [searchParams]);

  const { data: rooms = [], isLoading, isError, error, refetch } = useDestinations();

  const results = useMemo(() => filterDestinations(rooms, applied), [rooms, applied]);
  const tags = useMemo(() => collectTags(rooms), [rooms]);
  const bounds = useMemo(() => priceBounds(rooms), [rooms]);

  const activeCount = countActiveFilters(applied);

  useDocumentTitle(
    applied.location ? `Stays in ${applied.location}` : 'All destinations',
    'Search the full Luxe Reserve collection by location, price, guest count and style.',
  );

  const apply = useCallback(
    (criteria: SearchCriteria) => setSearchParams(writeCriteria(criteria)),
    [setSearchParams],
  );

  const clearFilters = useCallback(
    () => setSearchParams(new URLSearchParams(), { replace: true }),
    [setSearchParams],
  );

  return (
    <>
      <Section tone="canvas" spacing="sm" className="pb-0">
        <Shell>
          <SectionHeading
            as="h1"
            align="center"
            eyebrow="The collection"
            title="Find Your"
            accent="Escape"
            subtitle="Search the full collection, then pick your dates. No booking fees, and free cancellation on most stays."
          />
        </Shell>
      </Section>

      {/* `clip={false}` so the date-picker popover isn't cut off at the section
          edge, and z-30 so it layers above the results section below. */}
      <Section tone="canvas" spacing="sm" clip={false} className="relative z-30">
        <Shell className="relative z-20">
          {/*
            Keyed on the applied criteria so the search bar's internal draft
            resets when the URL changes (back/forward, or a link into a
            pre-filtered view) without syncing props into state in an effect.
          */}
          <SearchBar key={searchParams.toString()} initial={applied} onSubmit={apply} />
        </Shell>
      </Section>

      <Section tone="muted" spacing="md">
        <Shell className="flex flex-col gap-8">
          <FilterPanel
            value={applied}
            onChange={apply}
            onClear={clearFilters}
            tags={tags}
            bounds={bounds}
            resultCount={results.length}
            isLoading={isLoading}
          />

          <RoomGrid
            rooms={results}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            emptyTitle="No stays match your search"
            emptyMessage="Try widening your price range, removing a style filter, or lowering the guest count."
            emptyAction={
              activeCount > 0 ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              ) : undefined
            }
          />
        </Shell>
      </Section>
    </>
  );
}
