import { Router } from "express";
import userRouter from "./userRouter";
import DataRouter from "./DataRouters";
import authRouter from "./authRouter";
import chatRouter from "./ChatRouter";

const route = Router();

route.use("/users", userRouter);
route.use("/data", DataRouter);
route.use("/auth", authRouter);
route.use("/chat", chatRouter);

export default route;
