import type { NextFunction, Request, Response } from 'express';
import { getDeals } from '../services/explore.service';

export async function listDeals(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await getDeals());
  } catch (error) {
    next(error);
  }
}

/**
 * `createDeal` / `POST /api/deals` was removed.
 *
 * It was unauthenticated and unvalidated: it spread `req.body` straight into a
 * new `DestinationModel` and saved it, so any anonymous caller could write
 * arbitrary documents — fabricated listings, arbitrary prices — into the
 * collection the entire site reads from. Deals are reference data, seeded and
 * managed out of band. A real admin surface belongs behind an authenticated,
 * role-checked route.
 */
