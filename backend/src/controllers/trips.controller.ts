import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { CreateTripSchema } from '../utils/validation';
import { cancelTripForUser, createTripForUser, listTripsForUser } from '../services/trips.service';
import { sendBookingConfirmationEmail } from '../services/mailer.service';
import { HttpError } from '../utils/httpError';

/**
 * Trip handlers. This logic used to live inline in `trip.routes.ts` — the only
 * resource in the codebase that skipped the controller/service split every other
 * route followed, with `req: any` throughout and hand-rolled try/catch in each
 * handler.
 */

/** `verifyToken` guarantees `req.user`; this narrows it for TypeScript. */
function requireUser(req: AuthenticatedRequest): { id: string; email: string } {
  if (!req.user?.id) throw HttpError.unauthorized();
  return req.user;
}

export async function listTrips(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const trips = await listTripsForUser(requireUser(req).id);
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
}

export async function createTrip(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = requireUser(req);
    // Throws a ZodError, which the error middleware renders as a 400 with
    // per-field details.
    const input = CreateTripSchema.parse(req.body);
    const trip = await createTripForUser(user.id, input);

    // Confirmation mail must not be able to fail the booking that succeeded.
    void sendBookingConfirmationEmail(user.email, {
      reference: trip.tripId,
      title: trip.title,
      checkIn: trip.checkIn,
      checkOut: trip.checkOut,
    }).catch((error) => console.error('[trips] Confirmation email failed:', error));

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
}

export async function cancelTrip(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = requireUser(req);
    const trip = await cancelTripForUser(user.id, req.params.id as string);
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
}
