import type { Request, Response, NextFunction } from 'express';
import { getDestinations, getDestinationById, rateDestinationById } from '../services/explore.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { TripModel } from '../models/trip.model';

export async function listDestinations(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const destinations = await getDestinations();
    res.status(200).json(destinations);
  } catch (error) {
    next(error);
  }
}

export async function getDestination(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const destination = await getDestinationById(id);
    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }
    res.status(200).json(destination);
  } catch (error) {
    next(error);
  }
}

export async function rateDestination(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { rating } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Invalid rating. Must be a number between 1 and 5.' });
      return;
    }

    // Check if the user has a trip for this destination
    const existingTrip = await TripModel.findOne({ user: userId, destinationId: Number(id) }).exec();
    if (!existingTrip) {
      res.status(403).json({ error: 'You must book this destination before you can rate it.' });
      return;
    }

    const destination = await rateDestinationById(id, userId, rating);
    if (!destination) {
      res.status(404).json({ error: 'Destination not found' });
      return;
    }

    res.status(200).json(destination);
  } catch (error) {
    next(error);
  }
}
