import type { NextFunction, Request, Response } from 'express';
import {
  deleteReview,
  getDestinationById,
  getDestinations,
  upsertReview,
} from '../services/explore.service';
import { hasStayedAt } from '../services/trips.service';
import { UserModel } from '../models/user.model';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { DestinationIdParam, ReviewSchema } from '../utils/validation';
import { HttpError } from '../utils/httpError';

export async function listDestinations(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.status(200).json(await getDestinations());
  } catch (error) {
    next(error);
  }
}

export async function getDestination(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // `Number('abc')` is NaN, which Mongoose would otherwise surface as a
    // CastError from deep in the driver rather than a clean 400.
    const id = DestinationIdParam.parse(req.params.id);

    const destination = await getDestinationById(id);
    if (!destination) throw HttpError.notFound('Destination not found');

    res.status(200).json(destination);
  } catch (error) {
    next(error);
  }
}

export async function submitReview(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw HttpError.unauthorized();

    const id = DestinationIdParam.parse(req.params.id);
    const { rating, comment } = ReviewSchema.parse(req.body);

    // Only guests who actually booked may review.
    if (!(await hasStayedAt(req.user.id, id))) {
      throw HttpError.forbidden('You can only review destinations you have booked');
    }

    // Denormalise the display name so the reviews list needs no populate.
    const user = await UserModel.findById(req.user.id).select('name').exec();
    if (!user) throw HttpError.unauthorized();

    const destination = await upsertReview(id, {
      userId: req.user.id,
      authorName: user.name,
      rating,
      comment,
    });
    if (!destination) throw HttpError.notFound('Destination not found');

    res.status(200).json(destination);
  } catch (error) {
    next(error);
  }
}

export async function removeReview(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw HttpError.unauthorized();

    const id = DestinationIdParam.parse(req.params.id);
    const destination = await deleteReview(id, req.user.id);
    if (!destination) throw HttpError.notFound('Destination not found');

    res.status(200).json(destination);
  } catch (error) {
    next(error);
  }
}
