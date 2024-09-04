import { PrismaClient } from "@prisma/client";
import { subDays, subMinutes, subMonths, subWeeks } from "date-fns";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function generateProfileUpdateNotifications() {
  const sixMonthAgo = subMonths(new Date(), 6);
  const oneDayAgo = subDays(new Date(), 1);

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
    message: `<p>Hi ${user?.firstName},<br><p>We noticed that you have not updated your profile in a long time, so we are reaching out to remind you to update your information.</p><p>Some of the information you might need to update include:</p><ul><li>Your address,</li><li>Your profile picture,</li><li>Your biography,</li></ul><p>Kindly update this information as soon as you can to keep your information up to date!</p><div><a href='/dashboard/update-profile'>Update</a><a href='/dashboard/profile'>Not Updating</a></div><p>We hope you keep having a great time. Move around and chat with friends!</p><p>Best Regards,<br>The Admin</p>`,
    receiverId: user.id,
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
