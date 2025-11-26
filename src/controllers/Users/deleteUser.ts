import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) {
      const deleted = await prisma.user.delete({
        where: { id: userId },
      });
      if (deleted) {
        return res.status(201).json({ message: "User deleted successfully" });
      } else {
        return res.status(500).json({ message: "User delete failed" });
      }
    } else {
      return res.status(404).json({ error: "User not found!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
