import type { Request, Response } from 'express';

export function apiNotFound(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not found',
  });
}
