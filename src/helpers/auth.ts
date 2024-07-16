import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../Types/users";
const prisma = new PrismaClient();

const secret: string = "secret" || process.env.SECRET_KEY;

export const UserExistsWithId = async (userId: string): Promise<any> => {
  let user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export const UserExistsWithEmail = async (userEmail: string): Promise<any> => {
  let user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return user;
};

export const hashPassword = (password: string): string => {
  let salt = bcrypt.genSaltSync(10);
  let hashedPass = bcrypt.hashSync(password, salt);
  return hashedPass;
};

export const passwordCompare = (
  password: string,
  hashedPass: string
): boolean => {
  let answer = bcrypt.compareSync(password, hashedPass);
  return answer;
};

export const generateToken = (user: User): string => {
  const payload = {
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user?.role,
    profilePicture: user?.profileImage,
  };
  let token = jwt.sign(payload, secret, {
    expiresIn: Math.floor(Date.now() / 1000) + 24 * 3600,
  });
  return token;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};
