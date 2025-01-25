import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getGenders = async (req: Request, res: Response) => {
  try {
    const genders = await prisma.gender.findMany();
    res.status(200).send({
      message: "Genders",
      data: genders.filter((g) => g?.id !== 1),
      count: genders.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
