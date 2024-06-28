import { Router } from "express";
import AuthController from "../controllers/authController";
import { numbersController } from "../controllers/dashboardStats";

const statsRouter = Router();

statsRouter.get("/", numbersController);

export default statsRouter;
