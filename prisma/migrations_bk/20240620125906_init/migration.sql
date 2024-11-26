-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_districtId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_sectorId_fkey";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "workingSector" DROP NOT NULL,
ALTER COLUMN "districtId" DROP NOT NULL,
ALTER COLUMN "sectorId" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE SET NULL ON UPDATE CASCADE;
