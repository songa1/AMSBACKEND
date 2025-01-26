import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import XLSX from "xlsx";

const prisma = new PrismaClient();

export const exportUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        organizationEmployed: {
          include: {
            workingSector: true,
            state: true,
            district: true,
            country: true,
            sector: true,
          },
        },
        organizationFounded: {
          include: {
            workingSector: true,
            state: true,
            district: true,
            country: true,
            sector: true,
          },
        },
        residentCountry: true,
        residentDistrict: true,
        residentSector: true,
        gender: true,
        state: true,
        cohort: true,
        track: true,
      },
    });

    const formattedData = users.map((user) => ({
      "First Name": user?.firstName,
      "Middle Name": user?.middleName,
      "Second name": user?.lastName,
      "Email Address": user?.email,
      "Your personal Phone number": user?.phoneNumber,
      "Your WhatsApp number": user?.whatsappNumber,
      "Country of Residence": user?.residentCountry?.name,
      "State (If not in Rwanda)": user?.state?.name,
      "District of Residence (If in Rwanda)": user?.residentDistrict?.name,
      "Sector of Residence (If in Rwanda)": user?.residentSector?.name,
      "Nearest Landmark (School, Church, Mosque, Hotel, or any other common known mark)":
        user?.nearestLandmark,
      "Field of Study": user?.fieldOfStudy,
      Cohort: user?.cohort?.name,
      Track: user?.track?.name,
      Gender: user?.gender?.name,
      "The name of your Initiative (organization you Founded or co-founded)  if Available":
        user?.organizationFounded?.name,
      "Main Sector of intervention (Eg: Finance, Education, Agribusiness, Etc)":
        user?.organizationFounded?.workingSector?.name,
      "Position with that Organizaton  (Eg: Founder & CEO, Co-Founder &CEO) or other Position":
        user?.positionInFounded,
      "Country of the initiative (District/Sector)":
        user?.organizationFounded?.country?.name,
      "Website or any online presence of your initiative":
        user?.organizationFounded?.website,
      "Organization Name (If employed by another organization)":
        user?.organizationEmployed?.name,
      "Position in the organization employing you": user?.positionInEmployed,
      "Website of an Organization that Employs you (If available)":
        user?.organizationEmployed?.website,
      "Organization Address (Country)":
        user?.organizationEmployed?.country?.name,
      "LinkedIn Profile Link (https://linkedin.com/in/...)": user?.linkedin,
      "Instagram Profile Link (https://instagram.com/...)": user?.instagram,
      "Facebook Profile Link (https://facebook.com/...)": user?.facebook,
      "X (Twitter) Profile Link (https://x.com/...)": user?.twitter,
      "Last Updated Date": user?.updatedAt,
      "Time Joined": user?.createdAt,
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
