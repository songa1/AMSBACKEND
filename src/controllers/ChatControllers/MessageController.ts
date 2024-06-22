import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMessages = async (req: any, res: any) => {
  try {
    const messages = await prisma.message.findMany({
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

export const sendMessage = async (req: any, res: any) => {
  const { data: messageData } = req.body;
  console.log(messageData);
  try {
    const message = await prisma.message.create({
      data: {
        message: messageData.message,
        senderId: messageData.senderId,
        createdAt: new Date(),
      },
    });
    res.status(201).send({ message: "Message Sent", data: message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
