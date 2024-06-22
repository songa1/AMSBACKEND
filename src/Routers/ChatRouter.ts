import { Router } from "express";
import {
  getMessages,
  sendMessage,
} from "../controllers/ChatControllers/MessageController";

const chatRouter = Router();

chatRouter.post("/", sendMessage);
chatRouter.get("/", getMessages);

export default chatRouter;
