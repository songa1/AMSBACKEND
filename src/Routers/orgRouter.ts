import { Router } from "express";
import {
  getOrganization,
  getOrganizations,
} from "../controllers/Organization/listOrgs";
import { addOrganization } from "../controllers/Organization/createOrg";
import { assignOrganizationToUser } from "../controllers/Organization/assignToUser";
import { updateOrganization } from "../controllers/Organization/updateOrg";
import { removeOrganizationToUser } from "../controllers/Organization/removeOnUser";

const router = Router();

router.get("/", getOrganizations);
router.get("/:organizationId", getOrganization);
router.post("/", addOrganization);
router.patch("/assign", assignOrganizationToUser);
router.patch("/remove", removeOrganizationToUser);
router.patch("/", updateOrganization);

export default router;
