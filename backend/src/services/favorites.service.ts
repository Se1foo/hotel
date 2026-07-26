import { UserModel } from '../models/user.model';
import { DestinationModel, type IDestination } from '../models/explore.model';
import { getDestinationsByIds } from './explore.service';
import { HttpError } from '../utils/httpError';

/**
 * Saved stays.
 *
 * `User.savedDeals` existed on the schema from the start but was never read or
 * written by anything — a dead field. It is now the backing store for this
 * feature, holding stringified destination `id`s.
 */

function parseIds(saved: string[]): number[] {
  return saved.map(Number).filter(Number.isInteger);
}

export async function listFavoriteIds(userId: string): Promise<number[]> {
  const user = await UserModel.findById(userId).select('savedDeals').exec();
  if (!user) throw HttpError.notFound('User not found');
  return parseIds(user.savedDeals);
}

export async function listFavorites(userId: string): Promise<IDestination[]> {
  return getDestinationsByIds(await listFavoriteIds(userId));
}

export async function addFavorite(userId: string, destinationId: number): Promise<number[]> {
  // Verify the destination exists so the list can't accumulate dangling ids.
  const exists = await DestinationModel.exists({ id: destinationId }).exec();
  if (!exists) throw HttpError.badRequest('That destination does not exist');

  // `$addToSet` makes this idempotent — a double-tap can't create a duplicate.
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $addToSet: { savedDeals: String(destinationId) } },
    { new: true, select: 'savedDeals' },
  ).exec();

  if (!user) throw HttpError.notFound('User not found');
  return parseIds(user.savedDeals);
}

export async function removeFavorite(userId: string, destinationId: number): Promise<number[]> {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { savedDeals: String(destinationId) } },
    { new: true, select: 'savedDeals' },
  ).exec();

  if (!user) throw HttpError.notFound('User not found');
  return parseIds(user.savedDeals);
}
