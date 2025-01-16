import { Request, Response } from "express";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function assignOrganizationToUser(req: Request, res: Response) {
  try {
    const { userId, organizationId, relationshipType, position } = req.body;

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
            organizationFounded: {
              connect: {
                id: organizationId,
              },
            },
            positionInFounded: position,
          }
        : {
            organizationEmployed: {
              connect: {
                id: organizationId,
              },
            },
            positionInEmployed: position,
          };

    // Update the user record
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Respond with the updated user
    res.status(200).json({
      data: updatedUser,
      message: "Organization assigned successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while assigning the organization to the user",
    });
  }
}

export { assignOrganizationToUser };
