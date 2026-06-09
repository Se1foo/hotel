import type { Request, Response, NextFunction } from 'express';
import { getDeals, addDeal } from '../services/deals.service';

export async function listDeals(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deals = await getDeals();
    res.status(200).json(deals);
  } catch (error) {
    next(error);
  }
}

export async function createDeal(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const newDeal = await addDeal(req.body);
    res.status(201).json(newDeal);
  } catch (error) {
    next(error);
  }
}
