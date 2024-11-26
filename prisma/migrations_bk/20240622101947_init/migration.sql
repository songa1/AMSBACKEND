-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_genderName_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "genderName" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_genderName_fkey" FOREIGN KEY ("genderName") REFERENCES "Gender"("name") ON DELETE SET NULL ON UPDATE CASCADE;
