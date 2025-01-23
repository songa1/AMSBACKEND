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
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    const filteredMessages = messages.filter(
      (message) =>
        (message.receiverId == oid && message.senderId == id) ||
        (message.receiverId == id && message.senderId == oid)
    );
    res.status(200).send({
      message: "Messages",
      data: filteredMessages,
      count: filteredMessages.length,
    });
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
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    const filteredMessages = messages.filter(
      (message) =>
        message.receiverId == req.params.id || message.senderId == req.params.id
    );
    res.status(200).send({
      message: "Messages",
      data: filteredMessages,
      count: filteredMessages.length,
    });
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
          sender: { connect: { id: messageData.senderId } },
          public: true,
          createdAt: new Date(),
        },
      });
    } else {
      message = await prisma.message.create({
        data: {
          message: messageData.message,
          sender: { connect: { id: messageData.senderId } },
          receiver: { connect: { id: messageData.receiverId } },
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
