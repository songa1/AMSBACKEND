import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken, hashPassword, verifyToken } from "../helpers/auth";
import sendEmail from "../helpers/sendMail";

const prisma = new PrismaClient();

interface AuthController {
  login(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<Response>;
  requestLink(req: Request, res: Response): Promise<Response>;
  resetPassword(req: Request, res: Response): Promise<Response>;
  changePassword(req: Request, res: Response): Promise<Response>;
}

const AuthController: AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          organizationEmployed: {
            include: {
              district: true,
              sector: true,
            },
          },
          organizationFounded: {
            include: {
              district: true,
              sector: true,
            },
          },
          gender: true,
          residentCountry: true,
          residentDistrict: true,
          residentSector: true,
          cohort: true,
          role: true,
          track: true,
          profileImage: true,
        },
      });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = await generateToken(user);

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { token },
      });

      if (updatedUser) {
        return res
          .status(200)
          .json({ status: 200, message: "Login successful", token, user });
      } else {
        return res.status(500).json({ status: 500, message: "Login failed" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  changePassword: async (req, res) => {
    const { userId, pastPassword, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return res.status(401).json({ error: "User do not exist" });
      }
      const passwordMatch = await bcrypt.compare(pastPassword, user.password);
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ error: "Enter correct password, or use forgot password!" });
      }

      const newPassword = await hashPassword(password);

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { password: newPassword, token: null, refreshToken: null },
      });

      if (updatedUser) {
        return res.status(200).json({
          status: 200,
          message: "Password change is successful",
        });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: "Password change failed" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  logout: async (req, res) => {
    const { userId, token } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId, token },
      });
      if (!user) {
        return res.status(401).json({ error: "User do not exist!" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { token: null, refreshToken: null },
      });

      if (updatedUser) {
        return res
          .status(200)
          .json({ status: 200, message: "Logout successful" });
      } else {
        return res.status(500).json({ status: 500, message: "Logout failed" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  requestLink: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          role: true,
          track: true,
          profileImage: true,
        },
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
              "/reset-password/" +
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
        data: { password: hashedPassword, refreshToken: null },
      });

      const email = await sendEmail({
        receiver: user.email,
        subject: "Password Reset Successful",
        name: user?.firstName,
        message: "Your password has been changed successfully!",
      });
      if (email.status === 200) {
        return res.status(201).json({
          message: "Password changed successfully, you can log in now!",
          ...email,
        });
      } else {
        return res.status(500).json({
          message: "Failed to send the email!",
          ...email,
        });
      }
    } catch (error: any) {
      console.log(error?.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default AuthController;
