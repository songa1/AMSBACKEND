-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "receiverId" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
