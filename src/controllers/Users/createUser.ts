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

    const createdUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        residentCountry: {
          connect: {
            id: user?.residentCountryId
              ? user?.residentCountryId
              : "unspecified",
          },
        },
        residentDistrict: {
          connect: {
            id: user.residentDistrictId
              ? user?.residentDistrictId
              : "unspecified",
          },
        },
        residentSector: {
          connect: {
            id: user.residentSectorId ? user?.residentSectorId : "unspecified",
          },
        },
        phoneNumber: user.phoneNumber,
        whatsappNumber: user.whatsappNumber,
        gender: {
          connect: {
            name: user?.genderName ? user?.genderName : "Not Specified",
          },
        },
        nearestLandmark: user.nearestLandmark,
        cohort: { connect: { id: user?.cohortId ? user?.cohortId : 1 } },
        track: {
          connect: { id: user?.trackId ? user?.trackId : "unspecified" },
        },
        profileImage: {
          connect: {
            id: user?.profileImageId ? user?.profileImageId : "default",
          },
        },
        bio: user?.bio || "",
        state: {
          connect: {
            id: user?.state ? user?.state : "unspecified",
          },
        },
        fieldOfStudy: user?.fieldOfStudy,
        password: undefined,
        positionInEmployed: undefined,
        positionInFounded: undefined,
        organizationEmployedId: undefined,
        organizationFoundedId: undefined,
        refreshToken: refreshToken,
        facebook: user?.facebook || "",
        instagram: user?.instagram || "",
        linkedin: user?.linkedin || "",
        twitter: user?.twitter || "",
        createdAt: new Date(),
      },
    });

    if (createdUser) {
      const email = await sendEmail({
        subject: "Your profile on YALI AMS created successfully!",
        name: createdUser.firstName,
        message: `<div><p style="font-size: 16px; line-height: 1.5; color: #333;">
      Your profile has been successfully created on YALI Alumni Management System (AMS). Please use the link below to set your password:
    </p>
    <p style="font-size: 16px; line-height: 1.5;">
      <a href="${process.env.FRONTEND_URL}/reset-password/${createdUser.refreshToken}+email+${user?.email}" style="color: #0073e6; text-decoration: none;">
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
