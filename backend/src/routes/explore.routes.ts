import { Router } from 'express';
import { listDestinations, getDestination, rateDestination } from '../controllers/explore.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const exploreRouter = Router();

exploreRouter.get('/', listDestinations);
exploreRouter.get('/:id', getDestination);
exploreRouter.post('/:id/rate', verifyToken as any, rateDestination as any);

export default exploreRouter;
