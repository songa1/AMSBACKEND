import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../../helpers/sendMail";
import { generateToken } from "../../helpers/auth";
import { notificationTypes } from "../notificationController";

const prisma = new PrismaClient();

const CreateUserProfile = async (req: Request, res: Response) => {
  const { user } = req.body;

  const notificationToSend = await prisma.notificationSetup.findFirst({
    where: { usage: notificationTypes.SIGNUP },
  });

  if (!user?.email) {
    return res
      .status(409)
      .json({ error: "You can't add a user without email address!" });
  }

  try {
    const userExisting = await prisma.user.findFirst({
      where: { email: user?.email },
    });

    if (userExisting) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const refreshToken = generateToken(user);

    const newUserData: any = {};

    if (user?.firstName !== undefined) newUserData.firstName = user?.firstName;
    if (user?.middleName !== undefined)
      newUserData.middleName = user?.middleName;
    if (user?.lastName !== undefined) newUserData.lastName = user?.lastName;
    if (user?.email !== undefined) newUserData.email = user?.email;

    // Conditional relationships
    if (user?.residentDistrictId !== undefined) {
      newUserData.residentDistrict = {
        connect: { id: user?.residentDistrictId },
      };
    }
    if (user?.residentCountryId !== undefined) {
      newUserData.residentCountry = {
        connect: { id: user?.residentCountryId },
      };
    }
    if (user?.state !== undefined) {
      newUserData.state = { connect: { id: user?.state } };
      newUserData.residentDistrict = {
        connect: { id: "unspecified" },
      };
      newUserData.residentSector = {
        connect: { id: "unspecified" },
      };
    }
    if (user?.residentSectorId !== undefined) {
      newUserData.residentSector = {
        connect: { id: user?.residentSectorId },
      };
    }

    if (user?.phoneNumber !== undefined)
      newUserData.phoneNumber = user?.phoneNumber;
    if (user?.whatsappNumber !== undefined)
      newUserData.whatsappNumber = user?.whatsappNumber;
    if (user?.genderId !== undefined) {
      newUserData.gender = { connect: { id: user?.genderId } };
    }
    if (user?.nearestLandmark !== undefined)
      newUserData.nearestLandmark = user?.nearestLandmark;
    if (user?.cohortId !== undefined) {
      newUserData.cohort = { connect: { id: user?.cohortId } };
    }
    if (user?.trackId !== undefined) {
      newUserData.track = { connect: { id: user?.trackId } };
    }
    if (user?.bio !== undefined) newUserData.bio = user?.bio;
    if (user?.facebook !== undefined) newUserData.facebook = user?.facebook;
    if (user?.instagram !== undefined) newUserData.instagram = user.instagram;
    if (user?.linkedin !== undefined) newUserData.linkedin = user.linkedin;
    if (user?.twitter !== undefined) newUserData.twitter = user.twitter;

    // Additional properties
    newUserData.refreshToken = refreshToken;
    newUserData.createdAt = new Date();

    const createdUser = await prisma.user.create({
      data: newUserData,
    });

    if (createdUser) {
      const email = await sendEmail({
        subject: "Your profile on YALI AMS created successfully!",
        name: createdUser.firstName,
        message: `<div><p style="font-size: 16px; line-height: 1.5; color: #333;">
      Your profile has been successfully created on YALI Alumni Management System (AMS). Please use the link below to set your password:
    </p>
    <p style="font-size: 16px; line-height: 1.5;">
      <a href="${process.env.FRONTEND_URL}/reset-password/${createdUser.refreshToken}" style="color: #0073e6; text-decoration: none;">
        Set your password
      </a>
    </p>
    <p style="font-size: 14px; color: #777;">
      If you did not request this, please contact Admin immediately.
    </p></div>`,
        receiver: createdUser.email,
      });

      const notification = {
        title: "ACCOUNT: Your new account has been created!",
        message: notificationToSend!.message.replace(
          /\[name\]/g,
          createdUser?.firstName
        ),
        receiverId: createdUser?.id,
        opened: false,
        createdAt: new Date(),
      };

      await prisma.notifications.create({
        data: notification,
      });

      return res.status(201).json({
        message: "User created successfully",
        user: createdUser,
        ...email,
      });
    } else {
      return res.status(500).json({ message: "Create user failed" });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createFoundedOrganization = (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
  } catch (error: any) {}
};

export default CreateUserProfile;
