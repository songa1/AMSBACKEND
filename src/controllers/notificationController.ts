import { PrismaClient } from "@prisma/client";
import { subDays, subMonths } from "date-fns";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const notificationTypes = {
  SIGNUP: "signup",
  UPDATE: "updated",
  UPDATED: "updated",
};

export async function generateProfileUpdateNotifications() {
  const sixMonthAgo = subMonths(new Date(), 6);
  const oneDayAgo = subDays(new Date(), 1);
  const notification = await prisma.notificationSetup.findFirst({
    where: { usage: notificationTypes.UPDATE },
  });

  const users = await prisma.user.findMany({
    where: {
      updatedAt: {
        lt: sixMonthAgo,
      },
      Notifications: {
        none: {
          createdAt: {
            gt: oneDayAgo,
          },
          title: {
            contains: "UPDATE: You need to update your profile",
          },
        },
      },
    },
  });

  const notifications = users.map((user) => ({
    title: "UPDATE: You need to update your profile",
    message: notification!.message.replace(/\[name\]/g, user?.firstName),
    receiverId: user?.id,
    actions: notification?.link,
    opened: false,
    createdAt: new Date(),
  }));

  const createNotifications = await prisma.notifications.createMany({
    data: notifications,
  });

  console.log(
    "Profile update notifications have been created.",
    createNotifications
  );
}

export const getUsersNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        receiverId: req.params.userId,
      },
    });
    res.status(200).send({ message: "All notifications", notifications });
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUnopenedNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        receiverId: req.params.userId,
        opened: false,
      },
    });
    res
      .status(200)
      .send({ message: "All unopened notifications", notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const openNotification = async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notifications.update({
      where: {
        id: req.body.id,
      },
      data: {
        opened: true,
        updatedAt: new Date(),
      },
    });
    res.status(201).send({ message: "Notification opened", notification });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateNotificationDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const { message, link, usage } = req.body;
    const not = await prisma.notificationSetup.findFirst({ where: { usage } });

    if (!not) {
      return res
        .status(404)
        .send({ message: "This notification is not found!" });
    }

    const notification = await prisma.notificationSetup.update({
      where: { usage: usage },
      data: {
        message,
        link,
        updatedAt: new Date(),
      },
    });

    if (notification) {
      res.status(201).send({ message: "Notification updated", notification });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllNotificationSetups = async (req: Request, res: Response) => {
  try {
    const setups = await prisma.notificationSetup.findMany();

    res.status(200).send({ message: "Notification Setups", data: setups });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOneNotificationSetups = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const setup = await prisma.notificationSetup.findFirst({
      where: { id: id },
    });

    res.status(200).send({ message: "Notification Setup", data: setup });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
