/*
  Warnings:

  - Added the required column `title` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "title" TEXT NOT NULL;
