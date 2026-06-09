import type { Express } from 'express';
import authRouter from './auth.routes';
import bookingsRouter from './bookings.routes';
import dealsRouter from './deals.routes';
import healthRouter from './health.routes';
import exploreRouter from './explore.routes';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

export function registerRoutes(app: Express): void {
  app.use('/api/health', healthRouter);
  app.use('/api/explore', exploreRouter);
  app.use('/api/deals', dealsRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/auth', authLimiter, authRouter);
}
