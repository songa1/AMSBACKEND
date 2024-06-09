import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface AuthController {
  login(req: Request, res: Response): Promise<Response>;
  requestLink(req: Request, res: Response): Promise<Response>;
  resetPassword(req: Request, res: Response): Promise<Response>;
}

const AuthController: AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      // Here you can generate and send JWT token
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  requestLink: async (req, res) => {
    const { email } = req.body;
    try {
      // Here you can send a password reset link to the user's email
      return res.status(200).json({ message: 'Password reset link sent successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  resetPassword: async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

export default AuthController;
