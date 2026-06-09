import { DestinationModel, IDestination } from '../models/explore.model';

export async function getDestinations(): Promise<IDestination[]> {
  return DestinationModel.find().exec();
}
