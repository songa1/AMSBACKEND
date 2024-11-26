/*
  Warnings:

  - A unique constraint covering the columns `[usage]` on the table `NotificationSetup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NotificationSetup_usage_key" ON "NotificationSetup"("usage");
