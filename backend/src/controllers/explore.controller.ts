import type { Request, Response } from 'express';
import { getDestinations } from '../services/explore.service';

export function listDestinations(_req: Request, res: Response): void {
  res.status(200).json(getDestinations());
}
