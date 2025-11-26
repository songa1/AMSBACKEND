import { Router } from "express";
import {
  getMessages,
  getPrivateChats,
  getPrivateMessages,
  sendMessage,
} from "../controllers/ChatControllers/MessageController";
import { getTopActiveMembers } from "../controllers/ChatControllers/topMembers";

const chatRouter = Router();

chatRouter.get("/top", getTopActiveMembers);
chatRouter.post("/", sendMessage);
chatRouter.get("/", getMessages);
chatRouter.get("/:id/:oid", getPrivateMessages);
chatRouter.get("/:id", getPrivateChats);

export default chatRouter;
