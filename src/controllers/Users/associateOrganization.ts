import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdateOrganizationBody {
  userId: string;
  mode: "existing" | "new";
  existingOrganizationId?: number;
  newOrganizationData?: {
    name: string;
    workingSectorId?: string;
    districtId?: string;
    sectorId?: string;
    countryId?: string;
    stateId?: string;
    website?: string;
  };
  associationType: "founded" | "employed";
}

export const updateUserOrganization = async (req: Request, res: Response) => {
  const {
    userId,
    mode,
    existingOrganizationId,
    newOrganizationData,
    associationType,
  } = req.body as UpdateOrganizationBody;

  try {
    if (!userId || !associationType) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let organizationId: number = undefined as any;

    if (mode === "existing") {
      if (!existingOrganizationId) {
        return res.status(400).json({ error: "Organization ID is required." });
      }

      const orgExists = await prisma.organization.findFirst({
        where: { id: existingOrganizationId },
      });

      if (!orgExists) {
        return res.status(404).json({ error: "Organization not found." });
      }

      organizationId = existingOrganizationId;
    }

    if (mode === "new") {
      if (!newOrganizationData?.name) {
        return res
          .status(400)
          .json({ error: "Organization name is required." });
      }

      const newOrg = await prisma.organization.create({
        data: {
          name: newOrganizationData.name,
          workingSectorId: newOrganizationData.workingSectorId ?? null,
          countryId: newOrganizationData.countryId ?? null,
          stateId: newOrganizationData.stateId ?? null,
          districtId: newOrganizationData.districtId ?? null,
          sectorId: newOrganizationData.sectorId ?? null,
          website: newOrganizationData.website ?? null,
        },
      });

      organizationId = newOrg.id;
    }

    let updateData = {};

    if (associationType === "founded") {
      updateData = { organizationFoundedId: organizationId };
    } else if (associationType === "employed") {
      updateData = { organizationEmployedId: organizationId };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        organizationFounded: true,
        organizationEmployed: true,
      },
    });

    return res.status(200).json({
      message: "User organization updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
