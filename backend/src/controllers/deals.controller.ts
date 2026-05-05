import type { Request, Response } from 'express';
import { getDeals, addDeal } from '../services/deals.service';

export function listDeals(_req: Request, res: Response): void {
  res.status(200).json(getDeals());
}

export function createDeal(req: Request, res: Response): void {
  const newDeal = addDeal(req.body);
  res.status(201).json(newDeal);
}
