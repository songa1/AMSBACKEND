import { Router } from "express";
import {
  getUnopenedNotifications,
  getUsersNotifications,
  openNotification,
} from "../controllers/notificationController";

const router = Router();

router.get("/:userId", getUsersNotifications);
router.post("/", openNotification);
router.get("/unopened/:userId", getUnopenedNotifications);

export default router;
