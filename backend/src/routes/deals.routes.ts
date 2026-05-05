import { Router } from 'express';
import { listDeals, createDeal } from '../controllers/deals.controller';

const dealsRouter = Router();

dealsRouter.get('/', listDeals);
dealsRouter.post('/', createDeal);

export default dealsRouter;
