import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getTracks = async (req: Request, res: Response) => {
  try {
    const tracks = await prisma.track.findMany();
    res
      .status(200)
      .send({ message: "Tracks", data: tracks, count: tracks.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
