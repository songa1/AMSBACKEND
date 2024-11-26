-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_receiverId_fkey";

-- AlterTable
ALTER TABLE "Notifications" ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
