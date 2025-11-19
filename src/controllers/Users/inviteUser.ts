import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../../helpers/sendMail";
import { generateToken } from "../../helpers/auth";

const prisma = new PrismaClient();

export const inviteUser = async (req: Request, res: Response) => {
  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!firstName) {
    return res.status(400).json({ error: "First name is required" });
  }

  try {
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ error: "A user with this email already exists" });
    }

    const inviteToken = generateToken({ email });

    const createdUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName: "",
        middleName: "",
        phoneNumber: "",
        whatsappNumber: "",
        bio: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        twitter: "",
        password: "",
        refreshToken: inviteToken,
        createdAt: new Date(),
      },
    });

    await sendEmail({
      subject: "Your YALI AMS Account Invitation",
      name: firstName,
      message: `
        <div>
          <p>You have been invited to join YALI Alumni Management System (AMS).</p>
          <p>Please click the link below to set your password and complete your profile:</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${inviteToken}">
              Complete Your Registration
            </a>
          </p>
          <p>If this wasn't you, please contact admin.</p>
        </div>
      `,
      receiver: email,
    });

    return res.status(201).json({
      message: "Invitation sent successfully",
      user: createdUser,
    });
  } catch (err) {
    console.error("Invite user error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
