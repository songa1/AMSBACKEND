import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import path from "path";

export const uploadImage = async (req: any, res: any) => {
  try {
    const { profileImage } = req.files;

    if (!profileImage) return res.status(404).json({ error: "File Not Found" });

    const imagePath = path.join(
      __dirname,
      "../../../public/images/",
      profileImage.name
    );
    const publicPath = path
      .join("/images/", profileImage.name)
      .replace(/\\/g, "/");

    profileImage.mv(imagePath, async (err: any) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "File Upload Failed", message: err.message });
      }

      if (!/^image/.test(profileImage.mimetype))
        return res.status(400).json({ error: "Invalid Image" });

      try {
        const image = await prisma.image.create({
          data: {
            name: profileImage.name,
            link: publicPath,
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
    });
  } catch (error: any) {
    console.log(error?.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error?.message });
  }
};
