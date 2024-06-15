-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationEmployedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationFoundedId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_residentDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_residentSectorId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "residentDistrictId" DROP NOT NULL,
ALTER COLUMN "residentSectorId" DROP NOT NULL,
ALTER COLUMN "nearestLandmark" DROP NOT NULL,
ALTER COLUMN "track" DROP NOT NULL,
ALTER COLUMN "organizationFoundedId" DROP NOT NULL,
ALTER COLUMN "positionInFounded" DROP NOT NULL,
ALTER COLUMN "organizationEmployedId" DROP NOT NULL,
ALTER COLUMN "positionInEmployed" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_residentDistrictId_fkey" FOREIGN KEY ("residentDistrictId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_residentSectorId_fkey" FOREIGN KEY ("residentSectorId") REFERENCES "Sector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationFoundedId_fkey" FOREIGN KEY ("organizationFoundedId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationEmployedId_fkey" FOREIGN KEY ("organizationEmployedId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
