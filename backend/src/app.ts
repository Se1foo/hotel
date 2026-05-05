import cors from 'cors';
import express from 'express';
import path from 'path';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { apiNotFound } from './middlewares/notFound.middleware';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  registerRoutes(app);

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      apiNotFound(req, res);
      return;
    }

    next();
  });

  app.use((_req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });

  app.use(errorHandler);

  return app;
}
