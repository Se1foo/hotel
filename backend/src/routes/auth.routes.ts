import { Router } from 'express';
import { getProfile, login, register } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.get('/me', getProfile);
authRouter.post('/login', login);
authRouter.post('/register', register);

export default authRouter;
