import { Router } from "express";
import {
  getMessages,
  getPrivateChats,
  getPrivateMessages,
  sendMessage,
} from "../controllers/ChatControllers/MessageController";

const chatRouter = Router();

chatRouter.post("/", sendMessage);
chatRouter.get("/", getMessages);
chatRouter.get("/:id/:oid", getPrivateMessages);
chatRouter.get("/:id", getPrivateChats);

export default chatRouter;
