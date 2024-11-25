import { PrismaClient } from "@prisma/client";
import { genders } from "./genders";
import { cohorts } from "./cohorts";
import { roles } from "./role";
import { districtsData, sectorData } from "./locations";
import { tracks, users } from "./user";
import { workingSectors } from "./organization";
import { countries, states } from "./countries";
import { images } from "./images";
import { notifications } from "./notification";

const prisma = new PrismaClient();

const BATCH_SIZE = 100;

async function upsertData(data: any[], prismaModel: any) {
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    try {
      await prisma.$transaction(
        batch.map((item) =>
          prismaModel.upsert({
            where: { id: item.id },
            update: item,
            create: item,
          })
        )
      );
    } catch (error) {
      console.error(`Error seeding batch starting at index ${i}:`, error);
      throw error; // rethrow to stop seeding on failure
    }
  }
}

async function runSeeders() {
  try {
    await upsertData(genders, prisma.gender);
    await upsertData(cohorts, prisma.cohort);
    await upsertData(roles, prisma.role);
    await upsertData(districtsData, prisma.district);
    await upsertData(sectorData, prisma.sector);
    await upsertData(users, prisma.user);
    await upsertData(workingSectors, prisma.workingSector);
    await upsertData(tracks, prisma.track);
    await upsertData(countries, prisma.country);
    await upsertData(images, prisma.image);
    await upsertData(states, prisma.state);
    await upsertData(notifications, prisma.notificationSetup);

    console.log("Data seeding completed successfully.");
  } catch (error) {
    console.error("Data seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runSeeders();
