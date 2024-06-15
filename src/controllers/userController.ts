import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../Types/users";
import sendEmail from "../helpers/sendMail";

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
    const userData = await req.body.user;
    const organizationFounded = await req.body.organizationFounded;
    const organizationEmployed = await req.body.organizationEmployed;
    try {
      const organizationEmployedCreate = await prisma.organization.create({
        data: organizationEmployed,
      });
      const organizationFoundedCreate = await prisma.organization.create({
        data: organizationFounded,
      });

      const createdUser = await prisma.user.create({
        data: {
          firstName: userData?.firstName,
          middleName: userData?.middleName,
          lastName: userData?.lastName,
          email: userData?.email,
          residentDistrictId: userData?.residentDistrictId,
          residentSectorId: userData?.residentSectorId,
          phoneNumber: userData?.phoneNumber,
          whatsappNumber: userData?.whatsappNumber,
          genderName: userData?.genderName,
          nearestLandmark: userData?.nearestLandmark,
          cohortId: userData?.cohortId,
          track: userData?.track,
          organizationFoundedId: organizationFoundedCreate?.id,
          positionInFounded: userData?.positionInFounded,
          organizationEmployedId: organizationEmployedCreate?.id,
          positionInEmployed: userData?.positionInEmployed,
          password: userData?.password,
          createdAt: new Date(),
        },
      });

      return res
        .status(200)
        .json({ message: "User created succesfully", data: createdUser });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.params;
    const { user: userData } = req.body;
    const { id: foundedId, ...organizationFounded } = await req.body.organizationFounded;
    const { id: employedId, ...organizationEmployed } = await req.body.organizationEmployed;

    try {
      const organizationEmployedCreate = await prisma.organization.update({
        where: { id: employedId },
        data: organizationEmployed,
      });
      const organizationFoundedCreate = await prisma.organization.update({
        where: { id: foundedId },
        data: organizationFounded,
      });

      const updatedUser = await prisma.user.update({
        where: { id: userId },

        data: {
          firstName: userData?.firstName,
          middleName: userData?.middleName,
          lastName: userData?.lastName,
          email: userData?.email,
          residentDistrictId: userData?.residentDistrictId,
          residentSectorId: userData?.residentSectorId,
          phoneNumber: userData?.phoneNumber,
          whatsappNumber: userData?.whatsappNumber,
          genderName: userData?.genderName,
          nearestLandmark: userData?.nearestLandmark,
          cohortId: userData?.cohortId,
          track: userData?.track,
          organizationFoundedId: organizationFoundedCreate?.id,
          positionInFounded: userData?.positionInFounded,
          organizationEmployedId: organizationEmployedCreate?.id,
          positionInEmployed: userData?.positionInEmployed,
          password: userData?.password,
          updatedAt: new Date(),
        },
      });

      if (updatedUser) {
        const email = await sendEmail({ subject: "Profile updated successfully!", name: updatedUser?.firstName, message: "Your profile has been updated", receiver: updatedUser?.email })

        return res.status(201).json({ message: "User updated successfully!", user: updatedUser, ...email });

      } else {
        return res.status(201).json({ status: 500, message: "Updating user failed!" });
      }
    } catch (error: any) {
      console.log(error.message)
      return res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default UserController;
