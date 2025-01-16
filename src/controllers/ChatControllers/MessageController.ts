import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMessages = async (req: any, res: any) => {
  try {
    const messages = await prisma.message.findMany({
      where: { public: true },
      include: {
        sender: true,
      },
    });
    res
      .status(200)
      .send({ message: "Messages", data: messages, count: messages.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPrivateMessages = async (req: any, res: any) => {
  try {
    const { id, oid } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        public: false,
        AND: [
          {
            AND: [{ receiverId: id }, { senderId: oid }],
          },
          {
            AND: [{ receiverId: oid }, { senderId: id }],
          },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    res
      .status(200)
      .send({ message: "Messages", data: messages, count: messages.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPrivateChats = async (req: any, res: any) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        public: false,
        OR: [{ senderId: req.params.id }, { receiverId: req.params.id }],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    res
      .status(200)
      .send({ message: "Messages", data: messages, count: messages.length });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req: any, res: any) => {
  const { data: messageData } = req.body;
  let message: any;
  console.log(messageData);
  try {
    if (messageData?.receiverId == "") {
      message = await prisma.message.create({
        data: {
          message: messageData.message,
          senderId: messageData.senderId,
          public: true,
          createdAt: new Date(),
        },
      });
    } else {
      message = await prisma.message.create({
        data: {
          message: messageData.message,
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          public: false,
          createdAt: new Date(),
        },
      });
    }

    res.status(201).send({ message: "Message Sent", data: message });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error " + error?.message });
  }
};
