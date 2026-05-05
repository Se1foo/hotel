import { Router } from 'express';
import { listDeals } from '../controllers/deals.controller';

const dealsRouter = Router();

dealsRouter.get('/', listDeals);

export default dealsRouter;
