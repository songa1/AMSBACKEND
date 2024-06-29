import { Router } from "express";
import UserController from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Define routes
router.get("/", UserController.getAllUsers);
router.get("/:userId", UserController.getUserById);
router.post("/", UserController.createUser);
router.post("/bulk", UserController.bulkAddUsers);
router.put("/:userId", UserController.updateUser);
router.delete("/:userId", UserController.deleteUser);

export default router;
