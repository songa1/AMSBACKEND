import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getOrganizations(req: Request, res: Response) {
  try {
    const organizations = await prisma.organization.findMany();
    return res
      .status(200)
      .json({ message: "Organizations", data: organizations });
  } catch (error: any) {
    return res.status(200).json({ message: error?.message, data: null });
  }
}

async function getOrganization(req: Request, res: Response) {
  try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(400).json({ error: "organizationId is required" });
    }

    // Fetch the organization by ID
    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(organizationId, 10) },
      include: {
        workingSector: true,
        country: true,
        state: true,
        district: true,
        sector: true,
      },
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.status(200).json({ data: organization });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the organization" });
  }
}

export { getOrganizations, getOrganization };
