import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import multer from "multer";
import streamifier from "streamifier";

function uploadToCloudinary(buffer: any) {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });

    streamifier.createReadStream(buffer).pipe(upload_stream);
  });
}

export const uploadImage = async (req: any, res: any) => {
  try {
    const { profileImage } = req.files;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });

    const result: any = await uploadToCloudinary(profileImage.data);

    try {
      const image = await prisma.image.create({
        data: {
          name: profileImage.name,
          link: result?.secure_url,
          creatorId: req.body.userId,
          createdAt: new Date(),
        },
      });

      res.status(200).send({
        image: image,
        message: "File uploaded successfully!",
        name: profileImage.name,
      });
    } catch (prismaError: any) {
      console.error(prismaError);
      return res
        .status(500)
        .json({ error: "Database Error", message: prismaError.message });
    }
  } catch (error: any) {
    console.log(error?.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error?.message });
  }
};
