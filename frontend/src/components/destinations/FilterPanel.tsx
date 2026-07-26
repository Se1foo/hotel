import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { SearchCriteria, SortOption } from '../../lib/filters';
import { SORT_OPTIONS, countActiveFilters } from '../../lib/filters';
import { formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

/** Most style tags are long-tail; the rest sit behind a "+N more" toggle. */
const VISIBLE_TAG_LIMIT = 10;

interface FilterPanelProps {
  value: SearchCriteria;
  onChange: (criteria: SearchCriteria) => void;
  onClear: () => void;
  /** Tag vocabulary derived from the loaded data. */
  tags: string[];
  bounds: { min: number; max: number };
  resultCount: number;
  isLoading: boolean;
}

/**
 * Sorting and refinement controls.
 *
 * The destinations page previously offered only location and guest count, and
 * no sorting at all — with a dozen properties and no way to order them by price
 * or rating, the catalogue was effectively unbrowsable.
 *
 * Every change applies immediately and is written to the URL by the parent, so
 * a filtered view is shareable and survives a refresh.
 */
export function FilterPanel({
  value,
  onChange,
  onClear,
  tags,
  bounds,
  resultCount,
  isLoading,
}: FilterPanelProps) {
  const activeCount = countActiveFilters(value);
  const [showAllTags, setShowAllTags] = useState(false);

  /**
   * `tags` arrives ordered by frequency. Selected tags are always shown, even
   * when collapsed, so an active filter is never hidden from the user.
   */
  const visibleTags = showAllTags
    ? tags
    : Array.from(new Set([...tags.slice(0, VISIBLE_TAG_LIMIT), ...value.tags]));

  const hiddenCount = tags.length - visibleTags.length;

  const toggleTag = (tag: string) => {
    onChange({
      ...value,
      tags: value.tags.includes(tag)
        ? value.tags.filter((existing) => existing !== tag)
        : [...value.tags, tag],
    });
  };

  return (
    <section aria-label="Filter and sort" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-ink-subtle" aria-hidden="true" />
          <p aria-live="polite" className="text-ink-muted font-medium">
            {isLoading ? (
              'Searching…'
            ) : (
              <>
                <span className="font-bold text-ink">{resultCount}</span>{' '}
                {resultCount === 1 ? 'stay' : 'stays'}
                {activeCount > 0 && (
                  <span className="text-ink-subtle"> · {activeCount} filter{activeCount === 1 ? '' : 's'}</span>
                )}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm font-semibold text-ink whitespace-nowrap">
            Sort by
          </label>
          <select
            id="sort"
            value={value.sort}
            onChange={(event) => onChange({ ...value, sort: event.target.value as SortOption })}
            className="px-4 py-2.5 bg-surface border border-line hover:border-line-strong focus:border-gold rounded-full text-sm font-medium text-ink transition-colors"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-4 h-4" aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-x-8 gap-y-5 p-5 bg-surface border border-line rounded-panel">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-eyebrow uppercase text-ink mb-2">Nightly price</legend>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="min-price">
              Minimum nightly price
            </label>
            <input
              id="min-price"
              type="number"
              inputMode="numeric"
              min={0}
              step={50}
              placeholder={String(bounds.min)}
              value={value.minPrice ?? ''}
              onChange={(event) =>
                onChange({
                  ...value,
                  minPrice: event.target.value === '' ? null : Number(event.target.value),
                })
              }
              className="w-24 px-3 py-2 bg-canvas border border-line focus:border-gold rounded-xl text-sm font-medium text-ink transition-colors"
            />
            <span aria-hidden="true" className="text-ink-subtle">
              –
            </span>
            <label className="sr-only" htmlFor="max-price">
              Maximum nightly price
            </label>
            <input
              id="max-price"
              type="number"
              inputMode="numeric"
              min={0}
              step={50}
              placeholder={String(bounds.max)}
              value={value.maxPrice ?? ''}
              onChange={(event) =>
                onChange({
                  ...value,
                  maxPrice: event.target.value === '' ? null : Number(event.target.value),
                })
              }
              className="w-24 px-3 py-2 bg-canvas border border-line focus:border-gold rounded-xl text-sm font-medium text-ink transition-colors"
            />
          </div>
          <p className="text-xs text-ink-subtle">
            Collection ranges {formatPrice(bounds.min)}–{formatPrice(bounds.max)}
          </p>
        </fieldset>

        <div className="flex flex-col gap-2">
          <span className="text-eyebrow uppercase text-ink mb-1">Offers</span>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={value.dealsOnly}
              onChange={(event) => onChange({ ...value, dealsOnly: event.target.checked })}
              className="w-4 h-4 accent-gold rounded"
            />
            <span className="text-sm font-medium text-ink">Deals only</span>
          </label>
        </div>

        {tags.length > 0 && (
          <fieldset className="flex-1 min-w-[260px]">
            <legend className="text-eyebrow uppercase text-ink mb-2.5">Style</legend>
            <div className="flex flex-wrap items-center gap-2">
              {visibleTags.map((tag) => {
                const selected = value.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    // A multi-select group, so each is a toggle button rather
                    // than a radio.
                    aria-pressed={selected}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors border',
                      selected
                        ? 'bg-ink text-ink-inverse border-ink'
                        : 'bg-canvas text-ink-muted border-line hover:border-gold hover:text-gold',
                    )}
                  >
                    {tag}
                  </button>
                );
              })}

              {/* 12 properties yield ~27 tags; dumping them all made the panel a
                  wall of pills. Collapsed to the most common by default. */}
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllTags((open) => !open)}
                  aria-expanded={showAllTags}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-gold hover:text-gold-dark underline underline-offset-2"
                >
                  {showAllTags ? 'Show fewer' : `+${hiddenCount} more`}
                </button>
              )}
            </div>
          </fieldset>
        )}
      </div>

      {value.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Active style filters">
          {value.tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => toggleTag(tag)}
                aria-label={`Remove ${tag} filter`}
                className="group"
              >
                <Badge tone="soft" size="md" className="tracking-normal normal-case gap-2">
                  {tag}
                  <X
                    className="w-3 h-3 opacity-60 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Badge>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
