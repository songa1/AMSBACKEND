-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_creatorId_fkey";

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "creatorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
