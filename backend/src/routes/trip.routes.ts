import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { cancelTrip, createTrip, listTrips } from '../controllers/trips.controller';

const tripRouter = Router();

// Every trip route is owner-scoped.
tripRouter.use(verifyToken);

tripRouter.get('/', listTrips);
tripRouter.post('/', createTrip);
tripRouter.delete('/:id', cancelTrip);

/**
 * `POST /api/trips/migrate` was removed.
 *
 * It was a live, authenticated endpoint — described in its own comment as a
 * "Temporary endpoint to migrate mock trips" — that ran
 * `TripModel.deleteMany({ user: userId })` and then inserted two hardcoded
 * sample trips. Any authenticated caller could irreversibly destroy every
 * booking in their own account with a single request.
 */

export default tripRouter;
