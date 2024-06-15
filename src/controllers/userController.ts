import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../helpers/sendMail";
import { User } from "../Types/users";
import { generateToken } from "../helpers/auth";

const prisma = new PrismaClient();

interface UserController {
  getAllUsers(req: Request, res: Response): Promise<Response>;
  getUserById(req: Request, res: Response): Promise<Response>;
  createUser(req: Request, res: Response): Promise<Response>;
  bulkAddUsers(req: Request, res: Response): Promise<Response>; // New function declaration
  updateUser(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
}

const UserController: UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();

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
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createUser: async (req, res) => {
    const { user, organizationFounded, organizationEmployed } = req.body; // Destructure req.body directly

    try {
      const organizationFoundedCreate = await prisma.organization.create({
        data: organizationFounded,
      });

      const organizationEmployedCreate = await prisma.organization.create({
        data: organizationEmployed,
      });

      const refreshToken = await generateToken(user)

      const createdUser = await prisma.user.create({
        data: {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          residentDistrictId: user.residentDistrictId,
          residentSectorId: user.residentSectorId,
          phoneNumber: user.phoneNumber,
          whatsappNumber: user.whatsappNumber,
          genderName: user.genderName,
          nearestLandmark: user.nearestLandmark,
          cohortId: user.cohortId,
          track: user.track,
          organizationFoundedId: organizationFoundedCreate.id,
          positionInFounded: user.positionInFounded,
          organizationEmployedId: organizationEmployedCreate.id,
          positionInEmployed: user.positionInEmployed,
          password: user.password,
          refreshToken: refreshToken,
          createdAt: new Date(),
        },
      });

      if (createdUser) {
        const email = await sendEmail({ subject: "Your profile created successfully!", name: createdUser.firstName, message: "Your profile has been created on AMS. Use this link to set the password: " + process.env.FRONTEND_URL + "/reset-password/" + createdUser.refreshToken, receiver: createdUser.email });

        return res.status(201).json({ message: "User created successfully", user: createdUser, ...email });
      } else {
        return res.status(500).json({ message: "Create user failed" });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  bulkAddUsers: async (req, res) => {
    const { users } = req.body;

    try {
      const createdUsers = await Promise.all(
        users.map(async (user: User) => {
          // Check if user with same email exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // Handle duplicate email (skip or log)
            console.log(`User with email ${user.email} already exists. Skipping.`);
            return null; // Or handle as needed
          }

          // Create user if email doesn't exist
          const createdUser = await prisma.user.create({
            data: {
              firstName: user.firstName,
              middleName: user.middleName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              whatsappNumber: user.whatsappNumber,
              genderName: user.genderName,
              track: user.track,
              createdAt: new Date(),
            },
          });

          return createdUser;
        })
      );

      // Filter out null values (skipped users due to duplicates)
      const filteredUsers = createdUsers.filter((user) => user !== null);

      return res.status(200).json({ message: "Users created successfully", data: filteredUsers });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },


  updateUser: async (req, res) => {
    const { userId } = req.params;
    const { user, organizationFounded, organizationEmployed } = req.body;

    try {
      const organizationFoundedUpdate = await prisma.organization.update({
        where: { id: organizationFounded.id },
        data: organizationFounded,
      });

      const organizationEmployedUpdate = await prisma.organization.update({
        where: { id: organizationEmployed.id },
        data: organizationEmployed,
      });

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          residentDistrictId: user.residentDistrictId,
          residentSectorId: user.residentSectorId,
          phoneNumber: user.phoneNumber,
          whatsappNumber: user.whatsappNumber,
          genderName: user.genderName,
          nearestLandmark: user.nearestLandmark,
          cohortId: user.cohortId,
          track: user.track,
          organizationFoundedId: organizationFoundedUpdate.id,
          positionInFounded: user.positionInFounded,
          organizationEmployedId: organizationEmployedUpdate.id,
          positionInEmployed: user.positionInEmployed,
          password: user.password,
          updatedAt: new Date(),
        },
      });

      if (updatedUser) {
        const email = await sendEmail({ subject: "Profile updated successfully!", name: updatedUser.firstName, message: "Your profile has been updated", receiver: updatedUser.email });

        return res.status(201).json({ message: "User updated successfully", user: updatedUser, ...email });
      } else {
        return res.status(500).json({ message: "Updating user failed" });
      }
    } catch (error: any) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (user) {
        const deleted = await prisma.user.delete({
          where: { id: userId },
        });
        if (deleted) {
          return res.status(201).json({ message: "User deleted succesfully" });
        } else {
          return res.status(500).json({ message: "User delete failed" });
        }
      } else {
        return res.status(404).json({ error: "User not found!" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default UserController;

