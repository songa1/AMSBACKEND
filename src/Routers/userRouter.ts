import { Router } from "express";
import UserController from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";
import { ChangeUserRole } from "../controllers/DataControllers/RoleController";

const router = Router();

// Define routes
router.get("/", UserController.getAllUsers);
router.get("/:userId", UserController.getUserById);
router.post("/", UserController.createUser);
router.post("/bulk", UserController.bulkAddUsers);
router.put("/:userId", UserController.updateUser);
router.delete("/:userId", UserController.deleteUser);
router.post("/role/:userId", ChangeUserRole);

export default router;
