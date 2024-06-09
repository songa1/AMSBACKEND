import { Router } from "express";
import { getGenders } from "../controllers/DataControllers/GenderController";
import {
  getDistrict,
  getDistricts,
  getSector,
  getSectors,
  getSectorsByDistrict,
} from "../controllers/DataControllers/LocationController";
import { getCohorts } from "../controllers/DataControllers/CohortController";

const router = Router();

router.get("/genders", getGenders);
router.get("/districts", getDistricts);
router.get("/cohorts", getCohorts);
router.get("/district/:districtId", getDistrict);
router.get("/district/sector/:districtName", getSectorsByDistrict);
router.get("/sectors", getSectors);
router.get("/sector/:sectorId", getSector);

export default router;
