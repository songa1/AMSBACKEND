import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const ChangeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findFirst({ where: { id: userId } });
    let rolechanged;
    if (user) {
      if (user?.roleId === "11") {
        rolechanged = await prisma.user.update({
          where: { id: user?.id },
          data: { roleId: "12" },
        });
      } else {
        rolechanged = await prisma.user.update({
          where: { id: user?.id },
          data: { roleId: "11" },
        });
      }
      if (rolechanged) {
        res.status(201).send({ message: "User's role changed successfully!" });
      } else {
        res
          .status(500)
          .send({ message: "Failed to change user's role! Try again!" });
      }
    } else {
      res.status(404).send({ message: "User is not found!" });
    }
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};
