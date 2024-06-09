import { Router } from 'express';
import userRouter from './userRouter';
import DataRouter from './DataRouters';

const route = Router();

route.use('/users', userRouter);
route.use("/data", DataRouter);

export default route;
