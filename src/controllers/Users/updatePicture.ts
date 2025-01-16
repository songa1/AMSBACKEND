import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateProfile = async (req: Request, res: Response) => {
  const { userId, pictureId } = req.body;

  try {
    const userExists = await prisma.user.findFirst({ where: { id: userId } });

    if (!userExists) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: {
          connect: {
            id: pictureId,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ data: updatedUser, message: "Profile updated" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the profile picture" });
  }
};

export { updateProfile };
