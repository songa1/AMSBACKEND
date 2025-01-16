import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../../helpers/sendMail";
import { notificationTypes } from "../notificationController";

const prisma = new PrismaClient();

const updateUser = async (req: Request, res: Response) => {
  const { user } = req.body;

  const notificationToSend = await prisma.notificationSetup.findFirst({
    where: { usage: notificationTypes.UPDATED },
  });

  try {
    const userExists = await prisma.user.findFirst({ where: { id: user?.id } });

    if (!userExists) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const updatedUserData = {
      ...(user.firstName && { firstName: user.firstName }),
      ...(user.middleName && { middleName: user.middleName }),
      ...(user.lastName && { lastName: user.lastName }),
      ...(user.email && { email: user.email }),
      ...(user.residentDistrictId && {
        residentDistrict: { connect: { id: user.residentDistrictId } },
      }),
      ...(user.residentCountryId && {
        residentCountry: { connect: { id: user.residentCountryId } },
      }),
      ...(user.state && { state: { connect: { id: user.state } } }),
      ...(user.residentSectorId && {
        residentSector: { connect: { id: user.residentSectorId } },
      }),
      ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
      ...(user.whatsappNumber && { whatsappNumber: user.whatsappNumber }),
      ...(user.genderId && { gender: { connect: { id: user.genderId } } }),
      ...(user.nearestLandmark && { nearestLandmark: user.nearestLandmark }),
      ...(user.cohortId && { cohort: { connect: { id: user.cohortId } } }),
      ...(user.track && { track: { connect: { id: user.track } } }),
      ...(user.bio && { bio: user.bio }),
      ...(user.password && { password: user.password }),
      ...(user.facebook && { facebook: user.facebook }),
      ...(user.instagram && { instagram: user.instagram }),
      ...(user.linkedin && { linkedin: user.linkedin }),
      ...(user.twitter && { twitter: user.twitter }),
      updatedAt: new Date(),
    };

    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: updatedUserData,
    });

    if (updatedUser) {
      if (notificationToSend) {
        const notification = {
          title: "UPDATED: Your account has been updated!",
          message:
            notificationToSend?.message.replace(
              /\[name\]/g,
              updatedUser.firstName
            ) ?? undefined,
          receiverId: updatedUser?.id,
          opened: false,
          createdAt: new Date(),
        };

        await prisma.notifications.create({
          data: notification,
        });

        const email = await sendEmail({
          subject: notification?.title,
          name: updatedUser.firstName,
          message: notificationToSend!.message.replace(
            /\[name\]/g,
            updatedUser.firstName
          ),
          receiver: updatedUser.email,
        });
      }

      return res.status(201).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } else {
      return res.status(500).json({ message: "Updating user failed" });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { updateUser };
