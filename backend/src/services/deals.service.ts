import { DestinationModel, IDestination } from '../models/explore.model';

export async function getDeals() {
  return DestinationModel.find({ isDeal: true }).exec();
}

export async function addDeal(dealData: any) {
  const latestDeal = await DestinationModel.findOne().sort({ id: -1 }).exec();
  const nextId = latestDeal ? latestDeal.id + 1 : 1;
  
  const newDeal = new DestinationModel({
    ...dealData,
    isDeal: true,
    id: nextId
  });
  
  return newDeal.save();
}
