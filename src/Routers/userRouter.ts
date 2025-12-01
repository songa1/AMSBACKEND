import { Router } from "express";
import { ChangeUserRole } from "../controllers/DataControllers/RoleController";
import CreateUserProfile from "../controllers/Users/createUser";
import { inviteUser } from "../controllers/Users/inviteUser";
import { updateUser } from "../controllers/Users/updateUser";
import { updateUserOrganization } from "../controllers/Users/associateOrganization";
import { getAllUsers, getUserById } from "../controllers/Users/getUsers";
import { deleteUser } from "../controllers/Users/deleteUser";
import { importUsers } from "../controllers/Users/importUsers";

const router = Router();

router.get("/", getAllUsers); // used to get all users
router.get("/:userId", getUserById); // used to get user by ID
router.post("/invite", inviteUser); // used to invite user via email
router.post("/profile", CreateUserProfile); // used to add user profile
router.put("/org", updateUserOrganization); // used to associate organization while adding new users in bulk
router.post("/import", importUsers); // import multiple members
router.put("/:userId", updateUser); // update members data
router.delete("/:userId", deleteUser); // delete one user
router.post("/role/:userId", ChangeUserRole); // used to change user role

export default router;
