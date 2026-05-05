import type { Request, Response } from 'express';
import { getAuthRoadmapMessage } from '../services/auth.service';

export function login(_req: Request, res: Response): void {
  res.status(501).json({
    message: getAuthRoadmapMessage(),
  });
}

export function register(_req: Request, res: Response): void {
  res.status(501).json({
    message: getAuthRoadmapMessage(),
  });
}

export function getProfile(_req: Request, res: Response): void {
  res.status(501).json({
    message: getAuthRoadmapMessage(),
  });
}
