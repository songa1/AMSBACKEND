/*
  Warnings:

  - You are about to drop the column `districtName` on the `Organization` table. All the data in the column will be lost.
  - Added the required column `districtId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_districtName_fkey";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "districtName",
ADD COLUMN     "districtId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
