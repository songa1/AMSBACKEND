import { PrismaClient } from "@prisma/client";
import { subDays, subMonths, subWeeks } from "date-fns";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const numbersController = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  const notificationsUnopened = await prisma.notifications.findMany({
    where: { opened: false },
  });
  const messages = await prisma.message.findMany();
  const organizations = await prisma.organization.findMany();
  const sentNotifications = await prisma.notifications.findMany();

  res.status(200).send({
    users: users?.length,
    notificationsUnopened: notificationsUnopened?.length,
    messages: messages.length,
    sentNotifications: sentNotifications.length,
    organizations: organizations.length,
  });
};
