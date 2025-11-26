import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import sendEmail from "../../helpers/sendMail";
import { notificationTypes } from "../notificationController";
import { Organization } from "../../Types/org";

const updateOrCreateOrganization = async (
  data: Organization,
  existingId: number | null
) => {
  if (!data) return null;

  const existing = existingId
    ? await prisma.organization.findUnique({ where: { id: existingId } })
    : null;

  const payload = {
    name: data?.name ?? existing?.name ?? "Unnamed Organization",
    workingSector: {
      connect: {
        id: data?.workingSectorId ?? existing?.workingSectorId ?? "unspecified",
      },
    },
    district: {
      connect: {
        id: data?.districtId ?? existing?.districtId ?? "Not Specified",
      },
    },
    sector: {
      connect: { id: data?.sectorId ?? existing?.sectorId ?? "unspecified" },
    },
    country: {
      connect: { id: data?.countryId ?? existing?.countryId ?? "unspecified" },
    },
    state: {
      connect: { id: data?.stateId ?? existing?.stateId ?? "unspecified" },
    },
    website: data?.website ?? existing?.website ?? "#",
  };

  if (existingId && existing) {
    return prisma.organization.update({
      where: { id: existingId },
      data: payload as any,
    });
  }

  return prisma.organization.create({ data: payload as any });
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { user, organizationFounded, organizationEmployed } = req.body;

  try {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const foundedExisting = organizationFounded?.id
      ? await prisma.organization.findFirst({
          where: { id: organizationFounded.id },
        })
      : null;

    const employedExisting = organizationEmployed?.id
      ? await prisma.organization.findFirst({
          where: { id: organizationEmployed.id },
        })
      : null;

    const organizationFoundedUpdate = await updateOrCreateOrganization(
      organizationFounded,
      foundedExisting?.id || null
    );

    const organizationEmployedUpdate = await updateOrCreateOrganization(
      organizationEmployed,
      employedExisting?.id || null
    );

    const userUpdateData: any = {
      firstName: user?.firstName ?? existing.firstName,
      middleName: user?.middleName ?? existing.middleName,
      lastName: user?.lastName ?? existing.lastName,
      email: user?.email ?? existing.email,

      residentDistrict: {
        connect: {
          id: user?.residentDistrictId ?? existing.residentDistrictId,
        },
      },
      residentCountry: {
        connect: { id: user?.residentCountryId ?? existing.residentCountryId },
      },
      residentSector: {
        connect: { id: user?.residentSectorId ?? existing.residentSectorId },
      },
      state: {
        connect: { id: user?.state ?? existing.stateId },
      },

      phoneNumber: user?.phoneNumber ?? existing.phoneNumber,
      whatsappNumber: user?.whatsappNumber ?? existing.whatsappNumber,
      nearestLandmark: user?.nearestLandmark ?? existing.nearestLandmark,

      bio: user?.bio ?? existing.bio,

      cohort: {
        connect: { id: user?.cohortId ?? existing.cohortId },
      },
      track: {
        connect: { id: user?.track ?? existing.trackId },
      },
      gender: {
        connect: { name: user?.genderName ?? existing.genderName },
      },

      facebook: user?.facebook ?? existing.facebook,
      instagram: user?.instagram ?? existing.instagram,
      linkedin: user?.linkedin ?? existing.linkedin,
      twitter: user?.twitter ?? existing.twitter,

      positionInFounded: user?.positionInFounded ?? existing.positionInFounded,
      positionInEmployed:
        user?.positionInEmployed ?? existing.positionInEmployed,

      // Keep previous picture if no new one is sent
      profileImage: {
        connect: { id: user?.profileImageId ?? existing.profileImageId },
      },

      // Organization relations
      organizationFounded: organizationFoundedUpdate
        ? { connect: { id: organizationFoundedUpdate.id } }
        : existing.organizationFoundedId
        ? { connect: { id: existing.organizationFoundedId } }
        : undefined,

      organizationEmployed: organizationEmployedUpdate
        ? { connect: { id: organizationEmployedUpdate.id } }
        : existing.organizationEmployedId
        ? { connect: { id: existing.organizationEmployedId } }
        : undefined,

      updatedAt: new Date(),
    };

    // --------------------------
    // 3. UPDATE USER
    // --------------------------

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

    // --------------------------
    // 4. SEND NOTIFICATION
    // --------------------------

    const notificationToSend = await prisma.notificationSetup.findFirst({
      where: { usage: notificationTypes.UPDATED },
    });

    if (notificationToSend) {
      const notification = {
        title: "UPDATED: Your account has been updated!",
        message: notificationToSend.message.replace(
          /\[name\]/g,
          updatedUser.firstName
        ),
        receiverId: updatedUser.id,
        opened: false,
        createdAt: new Date(),
      };

      await prisma.notifications.create({ data: notification });

      await sendEmail({
        subject: notification.title,
        name: updatedUser.firstName,
        message: notification.message,
        receiver: updatedUser.email,
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
