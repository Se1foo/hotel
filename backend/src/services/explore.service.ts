import { DestinationModel, IDestination } from '../models/explore.model';

export async function getDestinations(): Promise<IDestination[]> {
  return DestinationModel.find().exec();
}

export async function getDestinationById(id: string): Promise<IDestination | null> {
  return DestinationModel.findOne({ id: Number(id) }).exec();
}

export async function rateDestinationById(destinationId: string, userId: string, rating: number): Promise<IDestination | null> {
  const destination = await DestinationModel.findOne({ id: Number(destinationId) }).exec();
  if (!destination) return null;

  // Initialize array if it doesn't exist
  if (!destination.userRatings) {
    destination.userRatings = [];
  }

  // Find if user already rated
  const existingRatingIndex = destination.userRatings.findIndex(r => r.userId.toString() === userId.toString());
  
  if (existingRatingIndex >= 0) {
    destination.userRatings[existingRatingIndex].rating = rating;
  } else {
    destination.userRatings.push({ userId, rating });
  }

  // Calculate new average
  const totalRating = destination.userRatings.reduce((sum, r) => sum + r.rating, 0);
  destination.rating = parseFloat((totalRating / destination.userRatings.length).toFixed(1));

  await destination.save();
  return destination;
}
