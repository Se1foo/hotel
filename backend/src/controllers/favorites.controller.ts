import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware';
import {
  addFavorite,
  listFavoriteIds,
  listFavorites,
  removeFavorite,
} from '../services/favorites.service';
import { DestinationIdParam } from '../utils/validation';
import { HttpError } from '../utils/httpError';

function requireUserId(req: AuthenticatedRequest): string {
  if (!req.user?.id) throw HttpError.unauthorized();
  return req.user.id;
}

/** Ids only — cheap enough for the client to fetch on load and drive heart icons. */
export async function getFavoriteIds(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json({ ids: await listFavoriteIds(requireUserId(req)) });
  } catch (error) {
    next(error);
  }
}

/** Full destination documents, for the saved-stays view. */
export async function getFavorites(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await listFavorites(requireUserId(req)));
  } catch (error) {
    next(error);
  }
}

export async function saveFavorite(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = requireUserId(req);
    const destinationId = DestinationIdParam.parse(req.params.id);
    res.status(200).json({ ids: await addFavorite(userId, destinationId) });
  } catch (error) {
    next(error);
  }
}

export async function unsaveFavorite(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = requireUserId(req);
    const destinationId = DestinationIdParam.parse(req.params.id);
    res.status(200).json({ ids: await removeFavorite(userId, destinationId) });
  } catch (error) {
    next(error);
  }
}
