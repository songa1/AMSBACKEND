import { Router } from "express";
import { uploadImage } from "../controllers/Upload/image";

const uploadRouter = Router();

uploadRouter.post("/image", uploadImage);

export default uploadRouter;
