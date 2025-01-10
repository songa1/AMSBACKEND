import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addOrganization(req: Request, res: Response) {
  try {
    const {
      name,
      workingSectorId,
      countryId,
      stateId,
      districtId,
      sectorId,
      website,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Insert into the database
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        workingSectorId,
        countryId,
        stateId,
        districtId,
        sectorId,
        website,
      },
    });

    res
      .status(201)
      .json({ data: newOrganization, message: "New Organization added" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the organization" });
  }
}

export { addOrganization };
