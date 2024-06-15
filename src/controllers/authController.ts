import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken, hashPassword, verifyToken } from "../helpers/auth";
import sendEmail from "../helpers/sendMail";

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
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      // Here you can generate and send JWT token
      return res.status(200).json({ message: "Login successful" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  requestLink: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        const refreshToken = await generateToken(user);
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken },
        });

        if (updatedUser) {
          const email = await sendEmail({
            receiver: user.email,
            subject: "Reset Password",
            name: user?.firstName,
            message:
              "Click on this link to reset your password, " +
              process.env.FRONTEND_URL +
              "/reset-password?token=" +
              updatedUser.refreshToken,
          });
          if (email.status === 200) {
            return res.status(201).json({
              message: "Link sent successfully, check your email!",
              ...email,
            });
          } else {
            return res.status(500).json({
              message: "Failed to send the email, try again!",
              ...email,
            });
          }
        } else {
          return res.status(500).json({
            message: "Failed to reset the password, try again!",
          });
        }
      } else {
        return res.status(404).json({ message: "User is not found!" });
      }
    } catch (error: any) {
      console.log(error?.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  resetPassword: async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const dataFromToken: any = await verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { email: dataFromToken?.email },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      return res.status(201).json({ message: "Password reset successful" });
    } catch (error: any) {
      console.log(error?.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default AuthController;
