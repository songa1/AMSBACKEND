import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getTopActiveMembers = async (req: Request, res: Response) => {
  try {
    const grouped = await prisma.message.groupBy({
      by: ["senderId"],
      _count: {
        senderId: true,
      },
      where: {
        senderId: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          senderId: "desc",
        },
      },
      take: 3,
    });

    if (grouped.length === 0) return [];

    const results = await Promise.all(
      grouped.map(async (g) => {
        const user = await prisma.user.findUnique({
          where: { id: g.senderId! },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageId: true,
          },
        });

        return {
          user,
          messageCount: g._count.senderId,
        };
      })
    );

    console.log("now results:", results);

    res.status(200).send({
      message: "Top Active Members",
      data: results,
      count: results.length,
    });
  } catch (err) {
    console.error("Error fetching top active members:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
