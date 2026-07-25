import type { Express } from 'express';
import authRouter from './auth.routes';
import tripRouter from './trip.routes';
import dealsRouter from './deals.routes';
import healthRouter from './health.routes';
import exploreRouter from './explore.routes';
import contactRouter from './contact.routes';
import favoritesRouter from './favorites.routes';
import { apiLimiter } from '../middlewares/rateLimiter.middleware';

export function registerRoutes(app: Express): void {
  // Health checks stay unthrottled so uptime probes don't trip the limiter.
  app.use('/api/health', healthRouter);

  // Broad backstop for the rest of the API. `/api/auth` layers its own tighter
  // per-endpoint limits on top of this.
  app.use('/api', apiLimiter);

  app.use('/api/explore', exploreRouter);
  app.use('/api/deals', dealsRouter);
  app.use('/api/trips', tripRouter);
  app.use('/api/favorites', favoritesRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/auth', authRouter);

  // `/api/bookings` was removed — every method returned 501 with the message
  // "Bookings are planned for a later phase of the hotel application." Bookings
  // are implemented as trips.
}
