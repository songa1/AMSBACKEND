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

export { getOrganizations };
