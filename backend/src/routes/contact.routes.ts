import { Router } from 'express';
import { submitContactMessage } from '../controllers/contact.controller';
import { contactLimiter } from '../middlewares/rateLimiter.middleware';

const contactRouter = Router();

// Unauthenticated write, so it gets the tightest limiter.
contactRouter.post('/', contactLimiter, submitContactMessage);

export default contactRouter;
