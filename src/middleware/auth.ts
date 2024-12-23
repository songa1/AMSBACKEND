/* eslint-disable no-undef */
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

export const protect = async (req: Request, res: Response, next: any) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //console.log(process.env.JWT_SECRET)
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log(decoded)
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      if (user) return next();

      else
       return res
         .status(301)
          .json({ message: "You are not authorized! Please login" });
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const isAdmin = (req: any, res: Response, next: any) => {
  let token;
  token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //console.log(decoded.role.id)
  if (decoded.role.id !== "11") {
    return res
      .status(403)
      .json({ message: "You are not authorized to access this page!" });
  }
  next();
};
