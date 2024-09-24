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

export const addCohorts = async (req: Request, res: Response) => {
  try {
    const existingCohort = await prisma.cohort.findFirst({
      where: { name: req.body.name },
    });

    console.log(req.body);

    if (existingCohort) {
      return res.status(400).send({ message: "Cohort already exists." });
    }

    const cohort = await prisma.cohort.create({
      data: {
        name: req.body.name,
        description: req.body.description,
      },
    });

    res.status(201).send({ message: "Cohort", data: cohort });
  } catch (error: any) {
    console.log(error?.message);
    return res.status(500).json({ error: "Failed to add cohort" });
  }
};

export const deleteCohorts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cohort = await prisma.cohort.delete({
      where: { id: Number(id) },
    });
    res.status(201).send({ message: "Cohort", data: cohort });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete cohort" });
  }
};
