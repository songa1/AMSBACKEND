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
    const cohorts = await prisma.cohort.findMany();
    if (!req.body.name || !req.body.description) {
      return res
        .status(400)
        .send({ message: "Cohort Name and Description are required." });
    }
    const cohort = await prisma.cohort.create({
      data: {
        id: Math.floor(Math.random() * 10000) + cohorts.length,
        name: req.body.name,
        description: req.body.description,
      },
    });

    return res.status(201).send({ message: "Cohort", data: cohort });
  } catch (error: any) {
    console.log(error);
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
