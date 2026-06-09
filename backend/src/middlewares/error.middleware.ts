import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Unexpected server error';
  
  res.status(statusCode).json({
    error: statusCode === 500 && env.nodeEnv === 'production'
      ? 'Internal Server Error'
      : message
  });
}
