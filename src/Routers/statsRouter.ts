import { Router } from "express";
import {
  communicationsPending,
  numbersController,
} from "../controllers/dashboardStats";

const statsRouter = Router();

statsRouter.get("/", numbersController);
statsRouter.get("/comms/:userId", communicationsPending);

export default statsRouter;
