import { Router } from "express";
import DataRouters from "./DataRouters";

const route = Router();

route.use("/data", DataRouters);

export default route;
