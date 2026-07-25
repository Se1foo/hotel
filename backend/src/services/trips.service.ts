import crypto from 'crypto';
import { TripModel, type ITrip } from '../models/trip.model';
import { DestinationModel } from '../models/explore.model';
import { HttpError } from '../utils/httpError';
import type { CreateTripInput } from '../utils/validation';

/**
 * Generates a booking reference server-side.
 *
 * The client used to send `TRP-${Math.floor(Math.random() * 100000)}`, which
 * collides often enough to matter (a few hundred bookings gives a better-than-
 * even chance by the birthday bound) and let a caller pick any reference it
 * liked, including one already belonging to another user.
 */
function generateTripReference(): string {
  return `TRP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function listTripsForUser(userId: string): Promise<ITrip[]> {
  return TripModel.find({ user: userId }).sort({ checkIn: 1 }).exec();
}

export async function createTripForUser(
  userId: string,
  input: CreateTripInput,
): Promise<ITrip> {
  /**
   * The request carries only the destination id and the stay details. Title,
   * location, image and price all come from the server's own record — the
   * previous version accepted them from the body, so a client could book a
   * "$1 penthouse" with any title and image it liked.
   */
  const destination = await DestinationModel.findOne({ id: input.destinationId }).exec();
  if (!destination) {
    throw HttpError.badRequest('That destination does not exist');
  }

  const capacity = Number(/\d+/.exec(destination.capacity)?.[0] ?? 0);
  if (capacity > 0 && input.guests > capacity) {
    throw HttpError.badRequest(`${destination.title} accommodates up to ${capacity} guests`);
  }

  // Reject a second overlapping booking for the same property by the same user.
  const overlapping = await TripModel.findOne({
    user: userId,
    destinationId: destination.id,
    status: { $ne: 'Cancelled' },
    checkIn: { $lt: input.checkOut },
    checkOut: { $gt: input.checkIn },
  }).exec();

  if (overlapping) {
    throw HttpError.conflict(
      `You already have a booking at ${destination.title} over those dates (${overlapping.tripId})`,
    );
  }

  const nights = Math.round(
    (input.checkOut.getTime() - input.checkIn.getTime()) / 86_400_000,
  );

  // Retry on the (rare) reference collision rather than failing the booking.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await TripModel.create({
        user: userId,
        tripId: generateTripReference(),
        destinationId: destination.id,
        destination: destination.location,
        title: destination.title,
        image: destination.image,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        nights,
        // Price is captured at booking time so a later catalogue change doesn't
        // silently rewrite what the guest agreed to pay.
        pricePerNight: destination.price,
        totalPrice: destination.price * nights,
        status: 'Confirmed',
      });
    } catch (error) {
      const isDuplicateKey = (error as { code?: number }).code === 11000;
      if (!isDuplicateKey) throw error;
    }
  }

  throw new HttpError(500, 'Could not allocate a booking reference. Please try again.');
}

/**
 * Cancels a trip. Scoped to the owner, so one user cannot cancel another's
 * booking by guessing an id.
 */
export async function cancelTripForUser(userId: string, tripId: string): Promise<ITrip> {
  const trip = await TripModel.findOne({ _id: tripId, user: userId }).exec();
  if (!trip) throw HttpError.notFound('Trip not found');

  if (trip.status === 'Cancelled') return trip;

  if (trip.checkOut < new Date()) {
    throw HttpError.badRequest('This stay has already ended and cannot be cancelled');
  }

  trip.status = 'Cancelled';
  await trip.save();
  return trip;
}

/** True when the user has a non-cancelled booking for the destination. */
export async function hasStayedAt(userId: string, destinationId: number): Promise<boolean> {
  const count = await TripModel.countDocuments({
    user: userId,
    destinationId,
    status: { $ne: 'Cancelled' },
  }).exec();
  return count > 0;
}
