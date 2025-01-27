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

    const updatedUserData: any = {};

    if (user?.firstName !== undefined)
      updatedUserData.firstName = user?.firstName;
    if (user?.middleName !== undefined)
      updatedUserData.middleName = user?.middleName;
    if (user?.lastName !== undefined) updatedUserData.lastName = user?.lastName;
    if (user?.email !== undefined) updatedUserData.email = user?.email;

    // Conditional relationships
    if (user?.residentDistrictId !== undefined) {
      updatedUserData.residentDistrict = {
        connect: { id: user?.residentDistrictId },
      };
    }
    if (user?.residentCountryId !== undefined) {
      updatedUserData.residentCountry = {
        connect: { id: user?.residentCountryId },
      };
    }
    if (user?.state !== undefined) {
      updatedUserData.state = { connect: { id: user?.state } };
      updatedUserData.residentDistrict = {
        connect: { id: "unspecified" },
      };
      updatedUserData.residentSector = {
        connect: { id: "unspecified" },
      };
    }
    if (user?.residentSectorId !== undefined) {
      updatedUserData.residentSector = {
        connect: { id: user?.residentSectorId },
      };
    }

    if (user?.phoneNumber !== undefined)
      updatedUserData.phoneNumber = user?.phoneNumber;
    if (user?.fieldOfStudy !== undefined)
      updatedUserData.fieldOfStudy = user?.fieldOfStudy;
    if (user?.whatsappNumber !== undefined)
      updatedUserData.whatsappNumber = user?.whatsappNumber;
    if (user?.genderId !== undefined) {
      updatedUserData.gender = { connect: { id: user?.genderId } };
    }
    if (user?.nearestLandmark !== undefined)
      updatedUserData.nearestLandmark = user?.nearestLandmark;
    if (user?.cohortId !== undefined) {
      updatedUserData.cohort = { connect: { id: user?.cohortId } };
    }
    if (user?.trackId !== undefined) {
      updatedUserData.track = { connect: { id: user?.trackId } };
    }
    if (user?.bio !== undefined) updatedUserData.bio = user?.bio;
    if (user?.facebook !== undefined) updatedUserData.facebook = user?.facebook;
    if (user?.instagram !== undefined)
      updatedUserData.instagram = user.instagram;
    if (user?.linkedin !== undefined) updatedUserData.linkedin = user.linkedin;
    if (user?.twitter !== undefined) updatedUserData.twitter = user.twitter;

    // Always update the updatedAt field
    updatedUserData.updatedAt = new Date();

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
          actions: notificationToSend?.link,
          opened: false,
          createdAt: new Date(),
        };

        await prisma.notifications.create({
          data: notification,
        });

        await sendEmail({
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
