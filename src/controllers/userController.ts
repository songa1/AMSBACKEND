import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../helpers/sendMail";
import { User } from "../Types/users";
import XLSX from "xlsx";

const prisma = new PrismaClient();

interface UserController {
  getAllUsers(req: Request, res: Response): Promise<Response>;
  getUserById(req: Request, res: Response): Promise<Response>;
  deleteUser(req: Request, res: Response): Promise<Response>;
}

const UserController: UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          organizationEmployed: {
            include: {
              district: true,
              sector: true,
              country: true,
              state: true,
              workingSector: true,
            },
          },
          organizationFounded: {
            include: {
              district: true,
              sector: true,
              country: true,
              state: true,
              workingSector: true,
            },
          },
          role: true,
          gender: true,
          residentDistrict: true,
          residentSector: true,
          residentCountry: true,
          cohort: true,
          state: true,
          track: true,
          profileImage: true,
        },
      });

      return res.status(200).json({
        message: "List of all users",
        data: users,
        count: users.length,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getUserById: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          organizationEmployed: {
            include: {
              district: true,
              sector: true,
              state: true,
              workingSector: true,
              country: true,
            },
          },
          organizationFounded: {
            include: {
              district: true,
              sector: true,
              workingSector: true,
              country: true,
              state: true,
            },
          },
          gender: true,
          residentDistrict: true,
          residentSector: true,
          cohort: true,
          role: true,
          state: true,
          track: true,
          profileImage: true,
          residentCountry: true,
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (user) {
        const deleted = await prisma.user.delete({
          where: { id: userId },
        });
        if (deleted) {
          return res.status(201).json({ message: "User deleted succesfully" });
        } else {
          return res.status(500).json({ message: "User delete failed" });
        }
      } else {
        return res.status(404).json({ error: "User not found!" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export const exportUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        organizationEmployed: true,
        organizationFounded: true,
        residentCountry: true,
        residentDistrict: true,
        residentSector: true,
        state: true,
        cohort: true,
        track: true,
      },
    });

    const formattedData = users.map((user) => ({
      "First Name": user.firstName,
      "Middle Name": user.middleName,
      "Last Name": user.lastName,
      "Email Address": user.email,
      "Phone Number": user.phoneNumber,
      "WhatsApp Number": user.whatsappNumber,
      "LinkedIn Profile": user.linkedin,
      "Instagram Profile": user.instagram,
      "Facebook Profile": user.facebook,
      "Twitter Profile": user.twitter,
      Gender: user.genderName,
      "Country of Residence": user.residentCountry?.name,
      "District of Residence": user.residentDistrict?.name || "",
      State: user.state?.name || "",
      "Sector of Residence": user.residentSector?.name || "",
      "Nearest Landmark": user.nearestLandmark || "",
      Cohort: user.cohort?.name || "",
      Track: user.track?.name || "",
      "Organization Founded": user.organizationFounded?.name || "",
      "Position in Organization Founded": user.positionInFounded || "",
      "Organization Employed": user.organizationEmployed?.name || "",
      "Position in Organization Employed": user.positionInEmployed || "",
      "Last Updated Date": user?.updatedAt || "",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet: any = XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users_data.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send({ data: excelBuffer });
  } catch (error: any) {
    return res
      .status(500)
      .send({ message: "An error occurred while exporting users.", error });
  }
};

export default UserController;
