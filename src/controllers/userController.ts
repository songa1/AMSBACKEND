import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserController {
  getAllUsers(req: Request, res: Response): Promise<Response>;
  getUserById(req: Request, res: Response): Promise<Response>;
  createUser(req: Request, res: Response): Promise<Response>;
  updateUser(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
}

const UserController: UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserById: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createUser: async (req, res) => {
    const userData = req.body;
    try {
      const createdUser = await prisma.user.create({
        data: userData,
      });
      return res.status(201).json(createdUser);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.params;
    const userData = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
      return res.json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default UserController;

