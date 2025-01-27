import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UserController {
  getAllUsers(req: Request, res: Response): Promise<Response>;
  getUserById(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
}

const UserController: UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          organizationEmployed: {
            include: {
              district: true,
              sector: true,
              country: true,
              state: true,
              workingSector: true,
            },
          },
          organizationFounded: {
            include: {
              district: true,
              sector: true,
              country: true,
              state: true,
              workingSector: true,
            },
          },
          role: true,
          gender: true,
          residentDistrict: true,
          residentSector: true,
          residentCountry: true,
          cohort: true,
          state: true,
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
  },

  getUserById: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          organizationEmployed: {
            include: {
              district: true,
              sector: true,
              state: true,
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
              state: true,
            },
          },
          gender: true,
          residentDistrict: true,
          residentSector: true,
          cohort: true,
          role: true,
          state: true,
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
  },

  deleteUser: async (req, res) => {
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
  },
};

export default UserController;
