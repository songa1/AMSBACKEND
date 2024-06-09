import { Router } from 'express';
import AuthController from '../controllers/authController';

const authRouter = Router();

// Define routes
authRouter.post('/login', AuthController.login);
authRouter.post('/request-link', AuthController.requestLink);
authRouter.post('/reset-password', AuthController.resetPassword);

export default authRouter;
