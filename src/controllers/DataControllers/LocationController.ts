import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getCountries = async (req: Request, res: Response) => {
  try {
    const countries = await prisma.country.findMany();
    res
      .status(200)
      .send({ message: "Countries", data: countries, count: countries.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStates = async (req: Request, res: Response) => {
  try {
    const states = await prisma.state.findMany();
    res
      .status(200)
      .send({ message: "States", data: states, count: states.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStatesByCountry = async (req: Request, res: Response) => {
  try {
    const countryCode = req.params.countryId;
    const states = await prisma.state.findMany({ where: { countryCode } });
    console.log(states);
    res
      .status(200)
      .send({ message: "States", data: states, count: states.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDistricts = async (req: Request, res: Response) => {
  try {
    const districts = await prisma.district.findMany();
    res
      .status(200)
      .send({ message: "Districts", data: districts, count: districts.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDistrict = async (req: Request, res: Response) => {
  const districtId = req.params.districtId as string;
  try {
    const district = await prisma.district.findFirst({
      where: { id: districtId },
    });
    res.status(200).send({ message: "District", data: district });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSectors = async (req: Request, res: Response) => {
  try {
    const sectors = await prisma.sector.findMany();
    res
      .status(200)
      .send({ message: "Sectors", data: sectors, count: sectors.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSector = async (req: Request, res: Response) => {
  const sectorId = req.params.sectorId as string;
  try {
    const sector = await prisma.sector.findFirst({ where: { id: sectorId } });
    const district = await prisma.district.findFirst({
      where: { name: sector?.districtName },
    });
    res.status(200).send({ message: "Sector", data: { ...sector, district } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSectorsByDistrict = async (req: Request, res: Response) => {
  const districtId = req.params.districtId;

  try {
    const district = await prisma.district.findFirst({
      where: { id: districtId },
    });

    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    const sectors = await prisma.sector.findMany({
      where: {
        districtName: district.name,
      },
    });

    return res.status(200).json({
      message: `Sectors in ${district.name}`,
      data: sectors,
      count: sectors.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
