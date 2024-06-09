import { PrismaClient } from "@prisma/client";
import { genders } from "./genders";
import { cohorts } from "./cohorts";
import { districtsData, sectorData } from "./locations";
const prisma = new PrismaClient();

async function upsertData(data: any, prismaModel: any) {
  return await prisma.$transaction(
    data.map((item: any) =>
      prismaModel.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      })
    )
  );
}

async function runSeeders() {
  try {
    await upsertData(genders, prisma.gender);
    await upsertData(cohorts, prisma.cohort);
    await upsertData(districtsData, prisma.district);
    await upsertData(sectorData, prisma.sector);
    // await upsertData(organizations, prisma.organization);

    console.log("Data seeding completed successfully.");
  } catch (error) {
    console.error("Data seeding failed:", error);
  }
}

runSeeders();
