import type { Request, Response, NextFunction } from 'express';
import { getDestinations } from '../services/explore.service';

export async function listDestinations(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const destinations = await getDestinations();
    res.status(200).json(destinations);
  } catch (error) {
    next(error);
  }
}
