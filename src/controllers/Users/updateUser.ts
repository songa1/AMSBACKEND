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

    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user?.email,
        residentDistrict: {
          connect: {
            id: user.residentDistrictId
              ? user.residentDistrictId
              : "unspecified",
          },
        },
        residentCountry: {
          connect: {
            id: user.residentCountryId ? user.residentCountryId : "unspecified",
          },
        },
        state: {
          connect: {
            id: user.state ? user.state : "unspecified",
          },
        },
        residentSector: {
          connect: {
            id: user.residentSectorId ? user.residentSectorId : "unspecified",
          },
        },
        phoneNumber: user.phoneNumber,
        whatsappNumber: user.whatsappNumber,
        gender: {
          connect: {
            id: user.genderId ? user.genderId : "unspecified",
          },
        },
        nearestLandmark: user.nearestLandmark,
        cohort: {
          connect: {
            id: user?.cohortId ? user?.cohortId : 1,
          },
        },
        track: { connect: { id: user.track ? user.track : "unspecified" } },
        bio: user?.bio || "",
        password: user.password,
        facebook: user?.facebook || "",
        instagram: user?.instagram || "",
        linkedin: user?.linkedin || "",
        twitter: user?.twitter || "",
        updatedAt: new Date(),
      },
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
