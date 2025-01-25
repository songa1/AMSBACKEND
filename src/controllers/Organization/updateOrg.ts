import { Request, Response } from "express";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateOrganization(req: Request, res: Response) {
  try {
    const {
      id,
      name,
      workingSectorId,
      countryId,
      state,
      districtId,
      sectorId,
      website,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "organizationId is required" });
    }

    const district = await prisma.

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (website) updateData.website = website;

    if (workingSectorId) {
      updateData.workingSector = {
        connect: { id: workingSectorId },
      };
    }
    if (countryId) {
      updateData.country = {
        connect: { id: countryId },
      };
    }
    if (state) {
      updateData.state = {
        connect: { id: state },
      };
      updateData.district = {
        connect: { id: "unspecified" },
      };
      updateData.sector = {
        connect: { id: "unspecified" },
      };
    }
    if (districtId) {
      updateData.district = {
        connect: { name: districtId },
      };
    }
    if (sectorId) {
      updateData.sector = {
        connect: { id: sectorId },
      };
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: id },
      data: updateData,
    });

    res
      .status(200)
      .json({ data: updatedOrganization, message: "Organization updated" });
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Organization not found" });
    }

    res
      .status(500)
      .json({ error: "An error occurred while updating the organization" });
  }
}

export { updateOrganization };
