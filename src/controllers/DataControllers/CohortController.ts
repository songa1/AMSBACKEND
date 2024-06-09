import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getCohorts = async (req: Request, res: Response) => {
  try {
    const cohorts = await prisma.cohort.findMany();
    res
      .status(200)
      .send({ message: "Cohorts", data: cohorts, count: cohorts.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
