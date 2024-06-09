import { Router } from 'express';
import userRouter from './userRouter';

const route = Router();

// Define routes
route.use('/users', userRouter);

export default route;