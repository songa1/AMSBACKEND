import { Router } from "express";
import userRouter from "./userRouter";
import DataRouter from "./DataRouters";
import authRouter from "./authRouter";
import chatRouter from "./ChatRouter";
import notificationRouter from "./notificationRouter";
import statsRouter from "./statsRouter";

const route = Router();

route.use("/users", userRouter);
route.use("/data", DataRouter);
route.use("/auth", authRouter);
route.use("/chat", chatRouter);
route.use("/notification", notificationRouter);
route.use("/stats", statsRouter);

export default route;
