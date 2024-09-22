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

export const addWorkingSector = async (req: Request, res: Response) => {
  try {
    const sector = await prisma.workingSector.create({
      data: {
        name: req.body.name,
      },
    });
    res.status(201).send({ message: "WorkingSector", data: sector });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to add working sector" });
  }
};

export const deleteWorkingSector = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const sector = await prisma.workingSector.delete({
      where: { id: id },
    });
    res.status(201).send({ message: "WorkingSector", data: sector });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete working sector" });
  }
};
