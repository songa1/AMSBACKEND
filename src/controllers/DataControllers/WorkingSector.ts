import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getWorkingSector = async (req: Request, res: Response) => {
  try {
    const workingSectors = await prisma.workingSector.findMany();
    res.status(200).send({
      message: "Tracks",
      data: workingSectors,
      count: workingSectors.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
