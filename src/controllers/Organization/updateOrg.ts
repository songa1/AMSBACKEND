import { Request, Response } from "express";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller to update organization details
async function updateOrganization(req: Request, res: Response) {
  try {
    const {
      organizationId,
      name,
      workingSectorId,
      countryId,
      stateId,
      districtId,
      sectorId,
      website,
    } = req.body;

    // Validate the required organizationId
    if (!organizationId) {
      return res.status(400).json({ error: "organizationId is required" });
    }

    // Construct the update data object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (workingSectorId) updateData.workingSectorId = workingSectorId;
    if (countryId) updateData.countryId = countryId;
    if (stateId) updateData.stateId = stateId;
    if (districtId) updateData.districtId = districtId;
    if (sectorId) updateData.sectorId = sectorId;
    if (website) updateData.website = website;

    // Update the organization
    const updatedOrganization = await prisma.organization.update({
      where: { id: organizationId },
      data: updateData,
    });

    // Respond with the updated organization
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
