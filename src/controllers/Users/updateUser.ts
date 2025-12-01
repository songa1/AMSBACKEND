import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import sendEmail from "../../helpers/sendMail";
import { notificationTypes } from "../notificationController";
import { Organization } from "../../Types/org";
import { safeConnect } from "../../helpers/safeConnect";

const updateOrCreateOrganization = async (
  data: Organization,
  existingId: number | null
) => {
  if (!data) return null;

  const existing = existingId
    ? await prisma.organization.findUnique({ where: { id: existingId } })
    : null;

  const payload: any = {
    name: data.name ?? existing?.name ?? undefined,
    website: data.website ?? existing?.website ?? undefined,
  };

  if (data.workingSectorId)
    payload.workingSector = safeConnect(data.workingSectorId);
  if (data.countryId) payload.country = safeConnect(data.countryId);
  if (data.stateId) payload.state = safeConnect(data.stateId);
  if (data.districtId) payload.district = safeConnect(data.districtId);
  if (data.sectorId) payload.sector = safeConnect(data.sectorId);

  if (existing) {
    return prisma.organization.update({
      where: { id: existingId! },
      data: payload,
    });
  }

  return prisma.organization.create({ data: payload });
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

    const organizationFoundedUpdate = await updateOrCreateOrganization(
      organizationFounded,
      organizationFounded?.id ?? null
    );

    const organizationEmployedUpdate = await updateOrCreateOrganization(
      organizationEmployed,
      organizationEmployed?.id ?? null
    );

    const userUpdateData: any = {
      firstName: user?.firstName ?? existing.firstName,
      middleName: user?.middleName ?? existing.middleName,
      lastName: user?.lastName ?? existing.lastName,
      email: user?.email ?? existing.email,
      phoneNumber: user?.phoneNumber ?? existing.phoneNumber,
      whatsappNumber: user?.whatsappNumber ?? existing.whatsappNumber,
      nearestLandmark: user?.nearestLandmark ?? existing.nearestLandmark,
      bio: user?.bio ?? existing.bio,

      facebook: user?.facebook ?? existing.facebook,
      instagram: user?.instagram ?? existing.instagram,
      linkedin: user?.linkedin ?? existing.linkedin,
      twitter: user?.twitter ?? existing.twitter,

      positionInFounded: user?.positionInFounded ?? existing.positionInFounded,
      positionInEmployed:
        user?.positionInEmployed ?? existing.positionInEmployed,
    };

    if (user?.residentDistrictId)
      userUpdateData.residentDistrict = safeConnect(user.residentDistrictId);

    if (user?.residentCountryId)
      userUpdateData.residentCountry = safeConnect(user.residentCountryId);

    if (user?.residentSectorId)
      userUpdateData.residentSector = safeConnect(user.residentSectorId);

    if (user?.state) userUpdateData.state = safeConnect(user.state);

    if (user?.cohortId) userUpdateData.cohort = safeConnect(user.cohortId);

    if (user?.trackId) userUpdateData.track = safeConnect(user.trackId);

    if (user?.genderName) userUpdateData.gender = safeConnect(user.genderName);

    if (user?.profileImageId)
      userUpdateData.profileImage = safeConnect(user.profileImageId);

    if (organizationFoundedUpdate) {
      userUpdateData.organizationFounded = safeConnect(
        organizationFoundedUpdate.id
      );
    }

    if (organizationEmployedUpdate) {
      userUpdateData.organizationEmployed = safeConnect(
        organizationEmployedUpdate.id
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });

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
