import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        organizationEmployed: {
          include: {
            district: true,
            sector: true,
            country: true,
            workingSector: true,
          },
        },
        organizationFounded: {
          include: {
            district: true,
            sector: true,
            country: true,
            workingSector: true,
          },
        },
        role: true,
        gender: true,
        residentDistrict: true,
        residentSector: true,
        residentCountry: true,
        cohort: true,
        track: true,
        profileImage: true,
      },
    });

    return res.status(200).json({
      message: "List of all users",
      data: users,
      count: users.length,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organizationEmployed: {
          include: {
            district: true,
            sector: true,
            workingSector: true,
            country: true,
          },
        },
        organizationFounded: {
          include: {
            district: true,
            sector: true,
            workingSector: true,
            country: true,
          },
        },
        gender: true,
        residentDistrict: true,
        residentSector: true,
        cohort: true,
        role: true,
        track: true,
        profileImage: true,
        residentCountry: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
