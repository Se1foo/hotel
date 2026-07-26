import { DestinationModel, type IDestination } from '../models/explore.model';

export async function getDestinations(): Promise<IDestination[]> {
  return DestinationModel.find().sort({ id: 1 }).exec();
}

export async function getDestinationById(id: number): Promise<IDestination | null> {
  return DestinationModel.findOne({ id }).exec();
}

/** Deals are destinations flagged `isDeal`. Merged in from `deals.service.ts`,
 *  which duplicated this query against the same model. */
export async function getDeals(): Promise<IDestination[]> {
  return DestinationModel.find({ isDeal: true }).sort({ id: 1 }).exec();
}

export async function getDestinationsByIds(ids: number[]): Promise<IDestination[]> {
  if (ids.length === 0) return [];
  return DestinationModel.find({ id: { $in: ids } })
    .sort({ id: 1 })
    .exec();
}

interface ReviewInput {
  userId: string;
  authorName: string;
  rating: number;
  comment?: string;
}

/**
 * Upserts a review and recomputes the destination's average rating.
 *
 * One review per user per destination: submitting again edits the existing one
 * rather than stacking duplicates and skewing the average.
 */
export async function upsertReview(
  id: number,
  input: ReviewInput,
): Promise<IDestination | null> {
  const destination = await DestinationModel.findOne({ id }).exec();
  if (!destination) return null;

  if (!destination.reviews) destination.reviews = [];

  const existing = destination.reviews.find(
    (review) => review.userId.toString() === input.userId,
  );

  if (existing) {
    existing.rating = input.rating;
    existing.comment = input.comment;
    existing.authorName = input.authorName;
    existing.createdAt = new Date();
  } else {
    destination.reviews.push({
      userId: input.userId,
      authorName: input.authorName,
      rating: input.rating,
      comment: input.comment,
      createdAt: new Date(),
    });
  }

  const total = destination.reviews.reduce((sum, review) => sum + review.rating, 0);
  destination.rating = Number((total / destination.reviews.length).toFixed(1));

  await destination.save();
  return destination;
}

export async function deleteReview(id: number, userId: string): Promise<IDestination | null> {
  const destination = await DestinationModel.findOne({ id }).exec();
  if (!destination) return null;

  const before = destination.reviews.length;
  destination.reviews = destination.reviews.filter(
    (review) => review.userId.toString() !== userId,
  );

  if (destination.reviews.length === before) return destination;

  // With no reviews left there is no average to show, so fall back to 0 rather
  // than dividing by zero and writing NaN into the document.
  destination.rating =
    destination.reviews.length === 0
      ? 0
      : Number(
          (
            destination.reviews.reduce((sum, review) => sum + review.rating, 0) /
            destination.reviews.length
          ).toFixed(1),
        );

  await destination.save();
  return destination;
}
