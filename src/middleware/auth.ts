import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../helpers/auth";
import { User } from "../Types/users";

const prisma = new PrismaClient();

export const authMiddleware = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const data: any = await verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { email: data?.email },
      });

      if (user) {
        if (user?.token === token) {
          return true;
        } else {
          res.status(401).send({ message: "Invalid Token, log in again!" });
        }
      } else {
        res.status(404).send({ message: "User is not found!" });
      }

      console.log(user);
    } else {
      res.status(401).send({ message: "You are not logged in!" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(400).send({ message: error?.message });
  }
};
