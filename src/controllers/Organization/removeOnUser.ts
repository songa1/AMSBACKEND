import { Request, Response } from "express";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function removeOrganizationToUser(req: Request, res: Response) {
  try {
    const { userId, organizationId, relationshipType } = req.body;

    if (!userId || !organizationId || !relationshipType) {
      return res.status(400).json({
        error: "userId, organizationId, and relationshipType are required",
      });
    }

    if (!["founded", "employed"].includes(relationshipType)) {
      return res.status(400).json({
        error:
          'Invalid relationshipType. Accepted values: "founded", "employed"',
      });
    }

    // Determine which field to update
    const updateData =
      relationshipType === "founded"
        ? {
            organizationFoundedId: null,
            positionInFounded: "",
          }
        : {
            organizationEmployedId: null,
            positionInEmployed: "",
          };

    // Update the user record
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Respond with the updated user
    res.status(200).json({
      data: updatedUser,
      message: "Organization removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while removing the organization from the user",
    });
  }
}

export { removeOrganizationToUser };
