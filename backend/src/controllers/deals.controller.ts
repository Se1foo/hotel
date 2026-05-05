import type { Request, Response } from 'express';
import { getDeals } from '../services/deals.service';

export function listDeals(_req: Request, res: Response): void {
  res.status(200).json(getDeals());
}
