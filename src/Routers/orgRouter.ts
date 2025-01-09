import { Router } from "express";
import { getOrganizations } from "../controllers/Organization/listOrgs";

const router = Router();

// Define routes
router.get("/", getOrganizations);

export default router;
