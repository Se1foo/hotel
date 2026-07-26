import { Router } from 'express';
import {
  getDestination,
  listDestinations,
  removeReview,
  submitReview,
} from '../controllers/explore.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const exploreRouter = Router();

exploreRouter.get('/', listDestinations);
exploreRouter.get('/:id', getDestination);

// Previously `verifyToken as any, rateDestination as any` — both casts removed.
// `/rate` is superseded by `/reviews`, which also carries the written review.
exploreRouter.put('/:id/reviews', verifyToken, submitReview);
exploreRouter.delete('/:id/reviews', verifyToken, removeReview);

export default exploreRouter;
