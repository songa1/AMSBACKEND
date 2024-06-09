import { Router } from 'express';
import userRouter from './userRouter';
import DataRouter from './DataRouters';
import authRouter from './authRouter';

const route = Router();

route.use('/users', userRouter);
route.use("/data", DataRouter);
route.use("/auth",authRouter)

export default route;
