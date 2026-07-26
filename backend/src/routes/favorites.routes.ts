import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import {
  getFavoriteIds,
  getFavorites,
  saveFavorite,
  unsaveFavorite,
} from '../controllers/favorites.controller';

const favoritesRouter = Router();

favoritesRouter.use(verifyToken);

favoritesRouter.get('/', getFavorites);
favoritesRouter.get('/ids', getFavoriteIds);
favoritesRouter.put('/:id', saveFavorite);
favoritesRouter.delete('/:id', unsaveFavorite);

export default favoritesRouter;
