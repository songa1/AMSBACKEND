import { Router } from "express";
import { isAdmin,protect } from "../middleware/auth";
import UserController, {
  exportUsers,
  importUsers,
} from "../controllers/userController";
import { ChangeUserRole } from "../controllers/DataControllers/RoleController";

const router = Router();

// Define routes
router.get("/all", UserController.getAllUsers);
router.get("/:userId", UserController.getUserById);
router.post("/", protect, isAdmin, UserController.createUser);
router.post("/import", importUsers);
router.post("/export", exportUsers);
router.post("/bulk", UserController.bulkAddUsers);
router.put("/update/:userId", UserController.updateUser);
router.delete("/delete/:userId", UserController.deleteUser);
router.post("/role/:userId", ChangeUserRole);

export default router;
