import { Router } from 'express';
import { listDeals } from '../controllers/deals.controller';

const dealsRouter = Router();

dealsRouter.get('/', listDeals);

// `POST /` removed — it accepted unauthenticated, unvalidated writes into the
// destinations collection. See `deals.controller.ts` for the full note.

export default dealsRouter;
