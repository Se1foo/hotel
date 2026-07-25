import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import { useDeals, getErrorMessage } from '../lib/api';
import type { Deal } from '../types';
import { formatPrice } from '../lib/format';
import { Section, SectionHeading, Shell } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { FilterPills } from '../components/ui/FilterPills';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const ALL = 'All deals';

/** Shared discount maths, so the badge and the card can't disagree. */
function discountPercent(deal: Deal): number | null {
  if (!deal.originalPrice || deal.originalPrice <= deal.price) return null;
  return Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
}

function PriceBlock({ deal, onDark = false }: { deal: Deal; onDark?: boolean }) {
  return (
    <p className="flex flex-col">
      {deal.originalPrice && (
        <span
          className={`text-[13px] font-medium line-through ${onDark ? 'text-white/60' : 'text-ink-faint'}`}
        >
          {formatPrice(deal.originalPrice)}
        </span>
      )}
      <span className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${onDark ? 'text-white' : 'text-ink'}`}>
          {formatPrice(deal.price)}
        </span>
        <span className={`text-sm font-normal ${onDark ? 'text-white/80' : 'text-ink-muted'}`}>
          /night
        </span>
      </span>
    </p>
  );
}

/**
 * The hero card. Note the whole card is not a click handler — the title carries
 * a real `<Link>` that the card stretches, so it is keyboard-navigable and
 * middle-clickable. The originals were `<article onClick={navigate}>` with a
 * duplicate inner button that needed `stopPropagation`.
 */
function FeaturedDealCard({ deal }: { deal: Deal }) {
  const discount = discountPercent(deal);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="group relative lg:col-span-8 min-h-[420px] rounded-panel overflow-hidden shadow-panel flex flex-col justify-end p-8 focus-within:ring-2 focus-within:ring-gold"
    >
      <SmartImage
        src={deal.image}
        alt={`${deal.title} in ${deal.location}`}
        priority
        wrapperClassName="absolute inset-0"
        className="transition-transform duration-1000 group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10"
      />

      <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
        {deal.dealTag && <Badge tone="gold">{deal.dealTag}</Badge>}
        {discount && <Badge tone="light">Save {discount}%</Badge>}
      </div>

      <div className="relative z-10 text-white flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-eyebrow uppercase text-white/85 mb-2">
            <MapPin className="w-4 h-4 text-amber shrink-0" aria-hidden="true" />
            {deal.location}
          </p>
          <h3 className="text-3xl md:text-4xl text-white">
            <Link to={`/destination/${deal.id}`} className="hover:underline">
              {deal.title}
              {/* Stretches the link's hit area over the whole card. */}
              <span className="absolute inset-0" aria-hidden="true" />
            </Link>
          </h3>
        </div>
        <div className="text-left md:text-right shrink-0">
          <PriceBlock deal={deal} onDark />
        </div>
      </div>
    </motion.article>
  );
}

function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const discount = discountPercent(deal);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.08 }}
      className="group relative lg:col-span-4 bg-surface rounded-panel border border-line overflow-hidden flex flex-col shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 focus-within:ring-2 focus-within:ring-gold"
    >
      <SmartImage
        src={deal.image}
        alt={`${deal.title} in ${deal.location}`}
        wrapperClassName="h-[220px]"
        className="transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
        {deal.dealTag && (
          <Badge tone="ink" size="sm">
            {deal.dealTag}
          </Badge>
        )}
        {discount && (
          <Badge tone="light" size="sm">
            −{discount}%
          </Badge>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="flex items-center gap-1.5 text-eyebrow uppercase text-gold mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {deal.location}
        </p>

        <h3 className="text-xl text-ink mb-4 leading-tight">
          <Link to={`/destination/${deal.id}`} className="hover:text-gold transition-colors">
            {deal.title}
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>
        </h3>

        <div className="mt-auto pt-4 border-t border-line flex justify-between items-end gap-3">
          <PriceBlock deal={deal} />
          <span className="flex items-center gap-1.5 text-sm font-bold text-gold group-hover:text-gold-dark transition-colors shrink-0">
            View deal
            <ArrowRight
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function DealsPage() {
  useDocumentTitle(
    'Exclusive deals',
    'Handpicked luxury stays at genuinely reduced nightly rates, updated weekly.',
  );

  const { data: deals = [], isLoading, isError, error, refetch } = useDeals();
  const [activeFilter, setActiveFilter] = useState<string>(ALL);

  // Derived before any early return, so the filter bar is always rendered from
  // the full result set. Previously these were computed *after* the loading /
  // error / empty guards, so the filters disappeared whenever they mattered.
  const filterOptions = useMemo(() => {
    const tags = new Set<string>();
    deals.forEach((deal) => deal.dealTag && tags.add(deal.dealTag));
    return [ALL, ...Array.from(tags).sort()];
  }, [deals]);

  const filtered = useMemo(
    () => (activeFilter === ALL ? deals : deals.filter((deal) => deal.dealTag === activeFilter)),
    [deals, activeFilter],
  );

  /**
   * Layout assignment. The old version picked `featured` by type *or*
   * `filtered[0]`, `medium` by type *or* `filtered[2]`, then dumped the
   * remainder into "small" — which left gaps in the 12-column grid whenever the
   * counts didn't line up, and read item 2 as "medium" for no reason.
   *
   * Now: the highest-discount deal leads at 8 columns, and everything else
   * tiles at 4 columns. Rows always divide evenly.
   */
  const { featured, rest } = useMemo(() => {
    if (filtered.length === 0) return { featured: null, rest: [] as Deal[] };

    const ranked = [...filtered].sort((a, b) => {
      if (a.dealType === 'featured' && b.dealType !== 'featured') return -1;
      if (b.dealType === 'featured' && a.dealType !== 'featured') return 1;
      return (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0);
    });

    return { featured: ranked[0], rest: ranked.slice(1) };
  }, [filtered]);

  // Spotlight comes from the *filtered* set — it used to read from the
  // unfiltered list, so it could advertise a deal excluded by the active filter.
  const spotlight = featured;

  if (isLoading) return <LoadingState message="Curating deals" className="min-h-[60vh]" />;

  if (isError) {
    return (
      <ErrorState
        title="We couldn't load the deals"
        message={getErrorMessage(error, 'Please check your connection and try again.')}
        onRetry={() => refetch()}
        className="min-h-[60vh]"
      />
    );
  }

  return (
    <>
      <Section tone="canvas" spacing="md" className="pb-0">
        <Shell>
          <SectionHeading
            as="h1"
            align="center"
            eyebrow="Limited availability"
            title="Exclusive"
            accent="Escapes"
            subtitle="Handpicked luxury at exceptional value. Every rate below is a genuine reduction on the property's standard nightly price."
          />

          {filterOptions.length > 1 && (
            <FilterPills
              label="Filter deals by category"
              options={filterOptions}
              value={activeFilter}
              onChange={setActiveFilter}
              className="mt-10"
            />
          )}
        </Shell>
      </Section>

      <Section tone="canvas" spacing="md">
        <Shell>
          {filtered.length === 0 ? (
            <EmptyState
              title={`No deals tagged “${activeFilter}”`}
              message="That category is empty right now. Try another, or view everything."
              action={
                <Button variant="outline" onClick={() => setActiveFilter(ALL)}>
                  View all deals
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-min">
              {featured && <FeaturedDealCard deal={featured} />}
              {rest.map((deal, index) => (
                <DealCard key={deal.id} deal={deal} index={index} />
              ))}
            </div>
          )}
        </Shell>
      </Section>

      {spotlight && (
        <section className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden">
          <SmartImage
            src={spotlight.image}
            alt=""
            aria-hidden="true"
            wrapperClassName="absolute inset-0"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/60" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center px-6 py-20 max-w-3xl mx-auto"
          >
            <p className="text-eyebrow uppercase text-amber mb-4">Destination spotlight</p>
            <h2 className="text-white text-display-sm md:text-display-md mb-6">
              {spotlight.location}
            </h2>
            <p className="text-white/90 text-lg mb-10 leading-relaxed text-pretty">
              {spotlight.description}
            </p>
            <Button variant="inverse" size="lg" to={`/destination/${spotlight.id}`}>
              Explore this deal
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </motion.div>
        </section>
      )}

      <Section tone="canvas" spacing="md">
        <Shell>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="bg-surface-inverse rounded-panel p-10 md:p-14 text-center text-ink-inverse relative overflow-hidden shadow-panel"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="relative z-10">
              <ShieldCheck className="w-12 h-12 text-amber mx-auto mb-6" aria-hidden="true" />
              <h2 className="text-3xl text-ink-inverse mb-4">Best price guarantee</h2>
              <p className="text-ink-inverse/75 max-w-2xl mx-auto mb-8 leading-relaxed text-pretty">
                Find a lower price elsewhere and we'll match it, then take a further 10% off. Book
                direct with confidence.
              </p>
              {/* Was a dead `<button>` labelled "Learn More". */}
              <Button variant="link" to="/terms" className="text-amber hover:text-white">
                Read the guarantee terms
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </motion.div>
        </Shell>
      </Section>
    </>
  );
}
