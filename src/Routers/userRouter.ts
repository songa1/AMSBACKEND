import { Router } from "express";
import UserController, {
  exportUsers,
  importUsers,
} from "../controllers/userController";
import { ChangeUserRole } from "../controllers/DataControllers/RoleController";
import CreateUserProfile from "../controllers/Users/createUser";

const router = Router();

// Define routes
router.get("/", UserController.getAllUsers);
router.get("/:userId", UserController.getUserById);
router.post("/", UserController.createUser);
router.post("/profile", CreateUserProfile);
router.post("/import", importUsers);
router.post("/export", exportUsers);
router.post("/bulk", UserController.bulkAddUsers);
router.put("/:userId", UserController.updateUser);
router.delete("/:userId", UserController.deleteUser);
router.post("/role/:userId", ChangeUserRole);

export default router;
