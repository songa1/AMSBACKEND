import { Router } from "express";
import { getGenders } from "../controllers/DataControllers/GenderController";
import {
  getDistrict,
  getDistricts,
  getSector,
  getSectors,
} from "../controllers/DataControllers/LocationController";
import { getCohorts } from "../controllers/DataControllers/CohortController";

const router = Router();

router.get("/genders", getGenders);
router.get("/cohorts", getCohorts);
router.get("/districts", getDistricts);
router.get("/district/:districtId", getDistrict);
router.get("/district/sector/:districtId", getDistrict);
router.get("/sectors", getSectors);
router.get("/sector/:sectorId", getSector);

export default router;
