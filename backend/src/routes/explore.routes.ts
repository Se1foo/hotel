import { Router } from 'express';
import { listDestinations } from '../controllers/explore.controller';

const exploreRouter = Router();

exploreRouter.get('/', listDestinations);

export default exploreRouter;
