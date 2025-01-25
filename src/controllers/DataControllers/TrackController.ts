import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getTracks = async (req: Request, res: Response) => {
  try {
    const tracks = await prisma.track.findMany();
    res.status(200).send({
      message: "Tracks",
      data: tracks.filter((s) => s?.name !== "Not Specified"),
      count: tracks.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addTrack = async (req: Request, res: Response) => {
  try {
    const track = await prisma.track.create({
      data: {
        name: req.body.name,
      },
    });
    res.status(201).send({ message: "Cohort", data: track });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to add track" });
  }
};

export const deleteTracks = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const track = await prisma.track.delete({
      where: { id: id },
    });
    res.status(201).send({ message: "Cohort", data: track });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to delete track" });
  }
};
