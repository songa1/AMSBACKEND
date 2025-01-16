import { Router } from "express";
import UserController, {
  exportUsers,
  importUsers,
} from "../controllers/userController";
import { ChangeUserRole } from "../controllers/DataControllers/RoleController";
import CreateUserProfile from "../controllers/Users/createUser";
import { updateUser } from "../controllers/Users/updateUser";
import { updateProfile } from "../controllers/Users/updatePicture";

const router = Router();

// Define routes
router.get("/", UserController.getAllUsers);
router.get("/:userId", UserController.getUserById);
router.post("/profile", CreateUserProfile);
router.post("/import", importUsers);
router.post("/export", exportUsers);
router.post("/bulk", UserController.bulkAddUsers);
router.patch("/", updateUser);
router.delete("/:userId", UserController.deleteUser);
router.post("/role/:userId", ChangeUserRole);
router.patch("/picture", updateProfile);

export default router;
