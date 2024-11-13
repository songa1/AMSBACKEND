import { Router } from "express";
import {
  getAllNotificationSetups,
  getOneNotificationSetups,
  getUnopenedNotifications,
  getUsersNotifications,
  openNotification,
  updateNotificationDetails,
} from "../controllers/notificationController";

const router = Router();

router.get("/:userId", getUsersNotifications);
router.post("/", openNotification);
router.get("/unopened/:userId", getUnopenedNotifications);
router.get("/update/setup", getAllNotificationSetups);
router.get("/update/setup/one", getOneNotificationSetups);
router.put("/update/setup", updateNotificationDetails);

export default router;
