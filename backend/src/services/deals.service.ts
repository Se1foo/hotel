import { DealModel, IDeal } from '../models/deal.model';

export async function getDeals(): Promise<IDeal[]> {
  return DealModel.find().exec();
}

export async function addDeal(dealData: Omit<IDeal, 'id' | '_id'>): Promise<IDeal> {
  const latestDeal = await DealModel.findOne().sort({ id: -1 }).exec();
  const nextId = latestDeal ? latestDeal.id + 1 : 1;
  
  const newDeal = new DealModel({
    ...dealData,
    id: nextId
  });
  
  return newDeal.save();
}
