import { Router } from "express";
import AuthController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);
authRouter.post("/change-pass", AuthController.changePassword);
authRouter.post("/request-link", AuthController.requestLink);
authRouter.post("/reset-password", AuthController.resetPassword);

export default authRouter;
