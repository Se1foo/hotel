import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BedDouble, MapPin, Share2, Star, Users } from 'lucide-react';
import { getErrorMessage, useCreateTrip, useDestination, useTrips } from '../lib/api';
import { useAuth } from '../components/auth/useAuth';
import { useToast } from '../components/ui/toast/useToast';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { AmenityIcon } from '../components/ui/AmenityIcon';
import {
  countNights,
  formatPrice,
  fromDateInputValue,
  pluralize,
  toDateInputValue,
} from '../lib/format';
import { Shell } from '../components/ui/Section';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { StarRating } from '../components/ui/StarRating';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { ErrorState, LoadingState } from '../components/ui/States';
import { Gallery } from '../components/destinations/Gallery';
import { ReviewSection } from '../components/destinations/ReviewSection';

const MAX_GUESTS = 20;

export default function DestinationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // `useLocation` was never imported here, so `location` resolved to the global
  // `window.location` and a whole DOM Location object was pushed into router
  // state. This is the router location it always meant to use.
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();

  const { data: destination, isLoading, isError, error, refetch } = useDestination(id);
  const { data: trips = [] } = useTrips(isAuthenticated);
  const createTrip = useCreateTrip();

  // Prefill from the search that brought the user here.
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') ?? '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') ?? '');
  const [guests, setGuests] = useState(() => {
    const fromUrl = Number(searchParams.get('guests'));
    return Number.isFinite(fromUrl) && fromUrl > 0 ? fromUrl : 2;
  });
  const [formError, setFormError] = useState<string | null>(null);

  const today = toDateInputValue(new Date());

  useDocumentTitle(
    destination ? `${destination.title}, ${destination.location}` : null,
    destination?.description.slice(0, 155),
  );

  /** The API only accepts reviews from guests who have actually booked. */
  const hasBooked = useMemo(
    () =>
      trips.some(
        (trip) => trip.destinationId === destination?.id && trip.status !== 'Cancelled',
      ),
    [trips, destination],
  );

  const maxGuests = useMemo(() => {
    if (!destination) return MAX_GUESTS;
    const parsed = Number(/\d+/.exec(destination.capacity)?.[0] ?? 0);
    return parsed > 0 ? parsed : MAX_GUESTS;
  }, [destination]);

  const nights = checkIn && checkOut ? countNights(checkIn, checkOut) : 0;

  if (isLoading) return <LoadingState message="Loading destination" className="min-h-[70vh]" />;

  if (isError || !destination) {
    return (
      <ErrorState
        title="Destination not found"
        message={getErrorMessage(error, 'This stay may have been removed, or the link is out of date.')}
        onRetry={() => refetch()}
        className="min-h-[70vh]"
      />
    );
  }

  const total = destination.price * nights;

  const handleBooking = async () => {
    setFormError(null);

    if (!isAuthenticated) {
      notify('Sign in to complete your reservation.', 'info');
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } });
      return;
    }

    // The old handler silently substituted "now" and "now + 3 days" for missing
    // dates, so an empty form produced a real booking the user never chose.
    const start = fromDateInputValue(checkIn);
    const end = fromDateInputValue(checkOut);

    if (!start || !end) {
      setFormError('Please choose both a check-in and a check-out date.');
      return;
    }
    if (end <= start) {
      setFormError('Your check-out date must be after your check-in date.');
      return;
    }
    if (guests > maxGuests) {
      setFormError(`This stay accommodates up to ${pluralize(maxGuests, 'guest')}.`);
      return;
    }

    try {
      // Only the id and stay details are sent — title, price and image come from
      // the server's own record, so a client can't book a "$1 penthouse".
      const trip = await createTrip.mutateAsync({
        destinationId: destination.id,
        checkIn: start.toISOString(),
        checkOut: end.toISOString(),
        guests,
      });
      notify(`Booked — reference ${trip.tripId}.`, 'success');
      navigate('/trips');
    } catch (mutationError) {
      setFormError(getErrorMessage(mutationError, 'We could not complete your booking.'));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      // Native share sheet on mobile, clipboard everywhere else.
      if (navigator.share) {
        await navigator.share({ title: destination.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      notify('Link copied to your clipboard.', 'success');
    } catch {
      // A cancelled share sheet or a denied clipboard permission is not an error
      // worth reporting.
    }
  };

  const reviewCount = destination.reviews.length;
  const gallery = destination.images.length > 0 ? destination.images : [destination.image];

  return (
    <>
      <div className="relative">
        <Gallery images={gallery} title={destination.title} />

        <Shell className="absolute inset-x-0 top-6 z-20 flex items-start justify-between pointer-events-none">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="pointer-events-auto grid place-items-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label={`Share ${destination.title}`}
              className="grid place-items-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white transition-colors"
            >
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </button>
            <FavoriteButton
              destinationId={destination.id}
              title={destination.title}
              variant="overlay"
              className="w-11 h-11"
            />
          </div>
        </Shell>
      </div>

      <Shell className="relative -mt-16 md:-mt-24 z-10 pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 w-full min-w-0 bg-surface rounded-panel p-7 md:p-10 shadow-panel border border-line"
          >
            <p className="flex items-center gap-1.5 text-eyebrow uppercase text-gold mb-3">
              <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
              {destination.location}
            </p>

            <h1 className="text-display-sm md:text-display-md text-ink mb-5">
              {destination.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="outline" size="lg" className="tracking-normal normal-case">
                <Star className="w-4 h-4 fill-star text-star" aria-hidden="true" />
                <span className="font-bold">
                  {destination.rating > 0 ? destination.rating.toFixed(1) : 'New'}
                </span>
                {reviewCount > 0 && (
                  <span className="text-ink-muted font-medium">
                    ({pluralize(reviewCount, 'review')})
                  </span>
                )}
              </Badge>

              {destination.tags?.map((tag) => (
                <Badge key={tag} tone="outline" size="lg" className="tracking-normal normal-case">
                  {tag}
                </Badge>
              ))}
            </div>

            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-8 border-t border-line">
              {/* Was `grid-cols-2 md:grid-cols-4` holding only two items, so
                  desktop showed two cells and a large void. */}
              <div>
                <dt className="text-ink-subtle text-sm mb-1">Guests</dt>
                <dd className="flex items-center gap-2 text-ink font-semibold">
                  <Users className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
                  {destination.capacity}
                </dd>
              </div>
              <div>
                <dt className="text-ink-subtle text-sm mb-1">Beds</dt>
                <dd className="flex items-center gap-2 text-ink font-semibold">
                  <BedDouble className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
                  {destination.beds}
                </dd>
              </div>
              <div>
                <dt className="text-ink-subtle text-sm mb-1">Rating</dt>
                <dd className="flex items-center gap-2 text-ink font-semibold">
                  <StarRating value={destination.rating} size="sm" />
                </dd>
              </div>
              <div>
                <dt className="text-ink-subtle text-sm mb-1">From</dt>
                <dd className="text-ink font-semibold">{formatPrice(destination.price)}/night</dd>
              </div>
            </dl>

            <section className="mt-8 pt-8 border-t border-line">
              <h2 className="text-2xl text-ink mb-4">About this place</h2>
              <p className="text-ink-muted leading-relaxed whitespace-pre-line text-lg text-pretty">
                {destination.description}
              </p>
            </section>

            <section className="mt-8 pt-8 border-t border-line">
              <h2 className="text-2xl text-ink mb-6">What this place offers</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
                {destination.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3 text-ink font-medium">
                    <AmenityIcon amenity={amenity} className="w-5 h-5 text-gold shrink-0" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-8 pt-8 border-t border-line">
              <ReviewSection destination={destination} canReview={hasBooked} />
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            aria-label="Book this stay"
            className="w-full lg:w-[380px] lg:sticky lg:top-28 shrink-0"
          >
            <div className="bg-surface rounded-panel p-7 shadow-panel border border-line">
              <div className="flex items-baseline justify-between gap-3 mb-7">
                <p className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-ink">
                    {formatPrice(destination.price)}
                  </span>
                  <span className="text-ink-muted font-medium">/ night</span>
                </p>
                {destination.originalPrice && destination.originalPrice > destination.price && (
                  <span className="text-sm text-ink-faint line-through">
                    {formatPrice(destination.originalPrice)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label
                    htmlFor="booking-check-in"
                    className="text-eyebrow uppercase text-ink block mb-2"
                  >
                    Check-in
                  </label>
                  <input
                    id="booking-check-in"
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(event) => {
                      setCheckIn(event.target.value);
                      // Clear any stale validation message as soon as the user
                      // addresses it, rather than leaving it under a now-valid form.
                      setFormError(null);
                      // Keep the range valid rather than letting it invert.
                      if (checkOut && event.target.value >= checkOut) setCheckOut('');
                    }}
                    className="w-full px-3 py-3 bg-canvas border border-line hover:border-line-strong focus:border-gold rounded-xl text-ink font-medium text-sm transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="booking-check-out"
                    className="text-eyebrow uppercase text-ink block mb-2"
                  >
                    Check-out
                  </label>
                  <input
                    id="booking-check-out"
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(event) => {
                      setCheckOut(event.target.value);
                      setFormError(null);
                    }}
                    className="w-full px-3 py-3 bg-canvas border border-line hover:border-line-strong focus:border-gold rounded-xl text-ink font-medium text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Guests was hardcoded to the string "2 Adults" with no control. */}
              <div className="mb-6">
                <label
                  htmlFor="booking-guests"
                  className="text-eyebrow uppercase text-ink block mb-2"
                >
                  Guests
                </label>
                <select
                  id="booking-guests"
                  value={guests}
                  onChange={(event) => {
                    setGuests(Number(event.target.value));
                    setFormError(null);
                  }}
                  className="w-full px-4 py-3 bg-canvas border border-line hover:border-line-strong focus:border-gold rounded-xl text-ink font-medium text-sm transition-colors"
                >
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map((count) => (
                    <option key={count} value={count}>
                      {pluralize(count, 'guest')}
                    </option>
                  ))}
                </select>
              </div>

              {nights > 0 && (
                <dl className="mb-6 pb-6 border-b border-line space-y-2.5 text-sm">
                  <div className="flex justify-between text-ink-muted">
                    <dt>
                      {formatPrice(destination.price)} × {pluralize(nights, 'night')}
                    </dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <dt>Booking fee</dt>
                    <dd className="text-success font-semibold">Free</dd>
                  </div>
                  <div className="flex justify-between text-ink font-bold text-base pt-2">
                    <dt>Total</dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                </dl>
              )}

              {formError && (
                <Alert tone="error" className="mb-4">
                  {formError}
                </Alert>
              )}

              <Button
                fullWidth
                size="lg"
                shape="rounded"
                isLoading={createTrip.isPending}
                onClick={handleBooking}
              >
                {isAuthenticated ? 'Reserve now' : 'Sign in to reserve'}
              </Button>

              <p className="text-center text-ink-subtle text-sm mt-4">You won't be charged yet</p>
            </div>
          </motion.aside>
        </div>
      </Shell>
    </>
  );
}
