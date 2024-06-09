/*
  Warnings:

  - The primary key for the `District` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sector` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residentDistrictId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `residentSectorId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_sectorId_fkey";

-- AlterTable
ALTER TABLE "District" DROP CONSTRAINT "District_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "District_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "District_id_seq";

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "sectorId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Sector" DROP CONSTRAINT "Sector_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sector_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sector_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "residentDistrictId" TEXT NOT NULL,
ADD COLUMN     "residentSectorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_residentDistrictId_fkey" FOREIGN KEY ("residentDistrictId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_residentSectorId_fkey" FOREIGN KEY ("residentSectorId") REFERENCES "Sector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
