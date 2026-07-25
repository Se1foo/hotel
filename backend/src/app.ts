import path from 'path';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { apiNotFound } from './middlewares/notFound.middleware';
import { env } from './config/env';

const CLIENT_DIST = path.join(__dirname, '../../frontend/dist');

export function createApp() {
  const app = express();

  // Behind a proxy (Render, Fly, Heroku, nginx) `req.ip` is the proxy's address
  // unless this is set, which would make the rate limiter bucket every visitor
  // into a single key.
  if (env.isProduction) app.set('trust proxy', 1);

  app.disable('x-powered-by');

  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      /**
       * Helmet's default CSP blocks the remote listing imagery and the Google
       * OAuth frames this app depends on, so serving the built SPA from Express
       * produced a page with no images and a broken sign-in. Declared
       * explicitly instead of left at defaults.
       */
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'https://accounts.google.com', 'https://apis.google.com'],
          // Vite injects inline styles for the critical CSS it extracts.
          styleSrc: ["'self'", "'unsafe-inline'"],
          fontSrc: ["'self'", 'data:'],
          imgSrc: [
            "'self'",
            'data:',
            'blob:',
            'https://images.unsplash.com',
            'https://lh3.googleusercontent.com',
          ],
          connectSrc: ["'self'", 'https://www.googleapis.com', 'https://accounts.google.com'],
          frameSrc: ["'self'", 'https://accounts.google.com'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: env.isProduction ? [] : null,
        },
      },
    }),
  );

  app.use(
    cors({
      // Was a single origin string. A list lets one deployment serve an apex and
      // a www host, or a preview environment alongside production.
      origin(origin, callback) {
        // Same-origin browser requests and non-browser callers send no Origin.
        if (!origin || env.allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
    }),
  );

  app.use(compression());
  app.use(cookieParser());
  // Explicit body caps. Aligned with the contact-form message limit.
  app.use(express.json({ limit: '32kb' }));
  app.use(express.urlencoded({ extended: false, limit: '32kb' }));

  registerRoutes(app);

  // Any unmatched /api route returns JSON, never the SPA shell. Previously this
  // sat after the static handlers and re-tested `req.path` by hand.
  app.use('/api', apiNotFound);

  // Vite content-hashes its assets, so they cache hard; index.html must not, or
  // returning clients pin themselves to a stale bundle.
  app.use(
    express.static(CLIENT_DIST, {
      index: false,
      maxAge: env.isProduction ? '1y' : 0,
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );

  // SPA fallback for client-side routes.
  app.use((_req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });

  // Must be last so it can catch errors thrown by everything above.
  app.use(errorHandler);

  return app;
}
