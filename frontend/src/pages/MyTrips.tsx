import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, List, Luggage, MapPin, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getErrorMessage, useCancelTrip, useTrips } from '../lib/api';
import { useAuth } from '../components/auth/useAuth';
import { useToast } from '../components/ui/toast/useToast';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { Trip, TripStatus } from '../types';
import { formatDate, formatPrice, pluralize } from '../lib/format';
import { Shell, SectionHeading } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SmartImage } from '../components/ui/SmartImage';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { TripCalendar } from '../components/trips/TripCalendar';
import { cn } from '../lib/utils';

type ViewMode = 'itinerary' | 'calendar';

const STATUS_TONES: Record<TripStatus, 'gold' | 'ink' | 'outline'> = {
  Confirmed: 'gold',
  Processing: 'ink',
  Cancelled: 'outline',
};

function TripRow({
  trip,
  onCancel,
  isCancelling,
  now,
}: {
  trip: Trip;
  onCancel: (trip: Trip) => void;
  isCancelling: boolean;
  /** Captured once by the page so every row agrees on "past". */
  now: number;
}) {
  const isPast = new Date(trip.checkOut).getTime() < now;
  const isCancelled = trip.status === 'Cancelled';

  return (
    <article
      className={cn(
        'bg-surface rounded-panel p-4 md:p-6 border border-line shadow-card hover:shadow-card-hover transition-shadow flex flex-col md:flex-row gap-6 group',
        isCancelled && 'opacity-70',
      )}
    >
      <SmartImage
        src={trip.image}
        alt={`${trip.title} in ${trip.destination}`}
        wrapperClassName="w-full md:w-[240px] h-[160px] rounded-xl shrink-0"
        className={cn(
          'group-hover:scale-105 transition-transform duration-500',
          isCancelled && 'grayscale',
        )}
      />

      <div className="flex-grow flex flex-col justify-between min-w-0">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <Badge tone={STATUS_TONES[trip.status]} size="sm">
              {trip.status}
            </Badge>
            {isPast && !isCancelled && (
              <Badge tone="outline" size="sm">
                Completed
              </Badge>
            )}
          </div>

          <p className="flex items-center gap-1.5 text-eyebrow uppercase text-gold mb-1.5">
            <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
            {trip.destination}
          </p>

          <h3 className="text-xl text-ink truncate">
            <Link
              to={`/destination/${trip.destinationId}`}
              className="hover:text-gold transition-colors"
            >
              {trip.title}
            </Link>
          </h3>
          <p className="text-ink-muted text-sm mt-1">Reference {trip.tripId}</p>
        </div>

        <dl className="flex flex-wrap items-start gap-x-8 gap-y-4 mt-5 pt-5 border-t border-line">
          <div>
            <dt className="text-eyebrow uppercase text-ink mb-1">Check in</dt>
            {/* Dates were rendered raw, so an ISO string from the booking flow
                displayed as "2026-07-25T12:33:00.000Z". */}
            <dd className="text-ink-muted text-sm font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {formatDate(trip.checkIn)}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow uppercase text-ink mb-1">Check out</dt>
            <dd className="text-ink-muted text-sm font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {formatDate(trip.checkOut)}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow uppercase text-ink mb-1">Guests</dt>
            <dd className="text-ink-muted text-sm font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {pluralize(trip.guests, 'guest')}
            </dd>
          </div>
          <div>
            <dt className="text-eyebrow uppercase text-ink mb-1">Total</dt>
            <dd className="text-ink text-sm font-bold">
              {formatPrice(trip.totalPrice)}
              <span className="text-ink-subtle font-medium">
                {' '}
                · {pluralize(trip.nights, 'night')}
              </span>
            </dd>
          </div>

          {/* Was a "Manage Trip" button with no handler at all. */}
          {!isPast && !isCancelled && (
            <div className="md:ml-auto self-end">
              <Button
                variant="ghost"
                size="sm"
                isLoading={isCancelling}
                onClick={() => onCancel(trip)}
                className="text-danger hover:text-danger hover:bg-danger-soft"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                Cancel trip
              </Button>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}

export default function MyTripsPage() {
  useDocumentTitle('My trips');

  const [viewMode, setViewMode] = useState<ViewMode>('itinerary');
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();
  const { data: trips = [], isLoading, isError, error, refetch } = useTrips(isAuthenticated);
  const cancelTrip = useCancelTrip();
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Captured once per mount rather than read during render: a lazy initialiser
  // keeps the render pure, and pins a single "now" so rows and sort order can't
  // disagree across re-renders.
  const [now] = useState(() => Date.now());

  // Upcoming first, then past — the old list was raw creation order.
  const sorted = useMemo(() => {
    const withTime = trips.map((trip) => ({ trip, time: new Date(trip.checkIn).getTime() }));
    const upcoming = withTime.filter((t) => t.time >= now).sort((a, b) => a.time - b.time);
    const past = withTime.filter((t) => t.time < now).sort((a, b) => b.time - a.time);
    return [...upcoming, ...past].map((t) => t.trip);
  }, [trips, now]);

  const upcomingCount = useMemo(
    () =>
      trips.filter(
        (trip) => trip.status !== 'Cancelled' && new Date(trip.checkOut).getTime() >= now,
      ).length,
    [trips, now],
  );

  const handleCancel = async (trip: Trip) => {
    setPendingId(trip._id);
    try {
      await cancelTrip.mutateAsync(trip._id);
      notify(`Cancelled ${trip.title} (${trip.tripId}).`, 'success');
    } catch (cancelError) {
      notify(getErrorMessage(cancelError, 'We could not cancel that trip.'), 'error');
    } finally {
      setPendingId(null);
    }
  };

  if (isLoading) return <LoadingState message="Loading your trips" className="min-h-[60vh]" />;

  if (isError) {
    return (
      <ErrorState
        title="We couldn't load your trips"
        message={getErrorMessage(error)}
        onRetry={() => refetch()}
        className="min-h-[60vh]"
      />
    );
  }

  return (
    <Shell className="py-14 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <SectionHeading
          as="h1"
          title="My"
          accent="Trips"
          subtitle={
            upcomingCount > 0
              ? `${pluralize(upcomingCount, 'upcoming stay')} booked. Manage dates or cancel any time.`
              : 'Manage your upcoming stays and revisit past itineraries.'
          }
        />

        {trips.length > 0 && (
          <div
            role="tablist"
            aria-label="Trip view"
            className="flex p-1 bg-surface border border-line rounded-full shadow-subtle w-fit shrink-0"
          >
            {(
              [
                { id: 'itinerary', label: 'Itinerary', icon: List },
                { id: 'calendar', label: 'Calendar', icon: Calendar },
              ] as const
            ).map(({ id, label, icon: Icon }) => {
              const active = viewMode === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setViewMode(id)}
                  className={cn(
                    'relative px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm transition-colors',
                    active ? 'text-white' : 'text-ink-muted hover:text-ink',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tripViewToggle"
                      className="absolute inset-0 bg-gold rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* The itinerary view previously rendered an empty `<div>` when a user had
          no trips — a blank page with no explanation and no way forward. */}
      {trips.length === 0 ? (
        <EmptyState
          icon={<Luggage className="w-7 h-7" aria-hidden="true" />}
          title="No trips booked yet"
          message="Once you reserve a stay it will appear here, with your dates, guest count and confirmation reference."
          action={
            <Button size="lg" to="/destinations">
              Browse destinations
            </Button>
          }
        />
      ) : (
        /**
         * A keyed enter-only animation rather than `AnimatePresence mode="wait"`.
         * This view sits inside the page-level `AnimatePresence mode="wait"` in
         * `App.tsx`, and nesting the two deadlocked: the outgoing panel never
         * finished exiting, so the incoming one never mounted and switching to
         * the calendar silently did nothing.
         */
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'itinerary' ? (
            <ul className="flex flex-col gap-6">
              {sorted.map((trip) => (
                <li key={trip._id}>
                  <TripRow
                    trip={trip}
                    now={now}
                    onCancel={handleCancel}
                    isCancelling={pendingId === trip._id}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <TripCalendar trips={sorted.filter((trip) => trip.status !== 'Cancelled')} />
          )}
        </motion.div>
      )}
    </Shell>
  );
}
