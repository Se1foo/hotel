import { Router } from 'express';
import { getProfile, login, register, refresh, logout } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', verifyToken as any, getProfile);

export default authRouter;
