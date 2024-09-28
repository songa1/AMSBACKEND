import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../helpers/sendMail";
import { User } from "../Types/users";
import { generateToken } from "../helpers/auth";
import fs from "fs";
import csvParser from "csv-parser";
import XLSX from "xlsx";
import { randomUUID } from "crypto";
import path from "path";

const prisma = new PrismaClient();

interface UserController {
  getAllUsers(req: Request, res: Response): Promise<Response>;
  getUserById(req: Request, res: Response): Promise<Response>;
  createUser(req: Request, res: Response): Promise<Response>;
  bulkAddUsers(req: Request, res: Response): Promise<Response>; // New function declaration
  updateUser(req: Request, res: Response): Promise<Response>;
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
              workingSector: true,
            },
          },
          organizationFounded: {
            include: {
              district: true,
              sector: true,
              country: true,
              workingSector: true,
            },
          },
          role: true,
          gender: true,
          residentDistrict: true,
          residentSector: true,
          residentCountry: true,
          cohort: true,
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
            },
          },
          gender: true,
          residentDistrict: true,
          residentSector: true,
          cohort: true,
          role: true,
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

  createUser: async (req, res) => {
    const { user, organizationFounded, organizationEmployed } = req.body;

    if (!user?.email) {
      return res
        .status(409)
        .json({ error: "You can't add a user without email address!" });
    }

    try {
      const userExisting = await prisma.user.findFirst({
        where: { email: user?.email },
      });

      if (userExisting) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      const organizationFoundedCreate = await prisma.organization.create({
        data: organizationFounded,
      });

      const organizationEmployedCreate = await prisma.organization.create({
        data: organizationEmployed,
      });

      const refreshToken = await generateToken(user);

      const createdUser = await prisma.user.create({
        data: {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email,
          residentCountry: {
            connect: {
              id: user?.residentCountryId
                ? user?.residentCountryId
                : "unspecified",
            },
          },
          residentDistrict: {
            connect: {
              id: user.residentDistrictId
                ? user?.residentDistrictId
                : "unspecified",
            },
          },
          residentSector: {
            connect: {
              id: user.residentSectorId
                ? user?.residentSectorId
                : "unspecified",
            },
          },
          phoneNumber: user.phoneNumber,
          whatsappNumber: user.whatsappNumber,
          gender: {
            connect: {
              name: user.genderName ? user?.genderName : "Not Specified",
            },
          },
          nearestLandmark: user.nearestLandmark,
          cohort: { connect: { id: user.cohortId ? user?.cohortId : 0 } },
          track: {
            connect: { id: user.trackId ? user?.trackId : "unspecified" },
          },
          profileImage: {
            connect: {
              id: user?.profileImageId ? user?.profileImageId : "default",
            },
          },
          bio: user?.bio || "",
          organizationFounded: {
            connect: { id: organizationFoundedCreate.id },
          },
          positionInFounded: user.positionInFounded,
          organizationEmployed: {
            connect: { id: organizationEmployedCreate.id },
          },
          state: {
            connect: {
              id: user?.state ? user?.state : "unspecified",
            },
          },
          positionInEmployed: user.positionInEmployed,
          password: user.password,
          refreshToken: refreshToken,
          facebook: user?.facebook || "",
          instagram: user?.instagram || "",
          linkedin: user?.linkedin || "",
          twitter: user?.twitter || "",
          createdAt: new Date(),
        },
      });

      if (createdUser) {
        const email = await sendEmail({
          subject: "Your profile on YALI AMS created successfully!",
          name: createdUser.firstName,
          message: `<div><p style="font-size: 16px; line-height: 1.5; color: #333;">
  Your profile has been successfully created on YALI Alumni Management System (AMS). Please use the link below to set your password:
</p>
<p style="font-size: 16px; line-height: 1.5;">
  <a href="${process.env.FRONTEND_URL}/reset-password/${createdUser.refreshToken}" style="color: #0073e6; text-decoration: none;">
    Set your password
  </a>
</p>
<p style="font-size: 14px; color: #777;">
  If you did not request this, please contact Admin immediately.
</p></div>`,
          receiver: createdUser.email,
        });

        const notification = {
          title: "ACCOUNT: Your new account has been created!",
          message: `<p>Hi ${user?.firstName},<br><p>Welcome aboard! Your account has been created and now you can start engaging with others through chats, and update your  profile from time to time!</p><p>Here's what you can do:</p><ul><li>Participate in conversations,</li><li>Monitor and update your profile,</li></ul><p>Again, you are most welcome, if you have any question, don't hesitate to contact the admin!</p><div><a href='/dashboard/chat'>Join Conversation</a><a href='/dashboard/profile'>View Profile</a></div><p>We hope you keep having a great time.</p><p>Best Regards,<br>The Admin</p>`,
          receiverId: createdUser?.id,
          opened: false,
          createdAt: new Date(),
        };

        await prisma.notifications.create({
          data: notification,
        });

        return res.status(201).json({
          message: "User created successfully",
          user: createdUser,
          ...email,
        });
      } else {
        return res.status(500).json({ message: "Create user failed" });
      }
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  bulkAddUsers: async (req, res) => {
    const { users } = req.body;

    try {
      console.log(users);
      const createdUsers = await Promise.all(
        users.forEach(async (user: User) => {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            console.log(
              `User with email ${user.email} already exists. Skipping.`
            );
            return res.status(400).send({ message: "User already exists!" });
          }

          const createdUser = await prisma.user.create({
            data: {
              firstName: user.firstName,
              middleName: user.middleName,
              lastName: user.lastName,
              email: user.email,
              residentCountry: {
                connect: {
                  id: user?.residentCountryId
                    ? user?.residentCountryId
                    : "unspecified",
                },
              },
              residentDistrict: {
                connect: {
                  name: user.residentDistrictId
                    ? user?.residentDistrictId
                    : "unspecified",
                },
              },
              residentSector: {
                connect: {
                  id: user.residentSectorId
                    ? user?.residentSectorId
                    : "unspecified",
                },
              },
              phoneNumber: user.phoneNumber,
              whatsappNumber: user.whatsappNumber,
              gender: {
                connect: {
                  name: user.genderName ? user?.genderName : "Not Specified",
                },
              },
              nearestLandmark: user.nearestLandmark,
              cohort: { connect: { id: user.cohortId ? user?.cohortId : 0 } },
              track: {
                connect: { id: user.trackId ? user?.trackId : "unspecified" },
              },
              bio: user?.bio || "",
              positionInFounded: user.positionInFounded,
              positionInEmployed: user.positionInEmployed,
              facebook: user?.facebook || "",
              instagram: user?.instagram || "",
              linkedin: user?.linkedin || "",
              twitter: user?.twitter || "",
              createdAt: new Date(),
            },
          });

          if (createdUser) {
            const email = await sendEmail({
              subject: "Your profile on YALI AMS created successfully!",
              name: createdUser.firstName,
              message: `<div><p style="font-size: 16px; line-height: 1.5; color: #333;">
      Your profile has been successfully created on YALI Alumni Management System (AMS). Please use the link below to set your password:
    </p>
    <p style="font-size: 16px; line-height: 1.5;">
      <a href="${process.env.FRONTEND_URL}/reset-password/${createdUser.refreshToken}" style="color: #0073e6; text-decoration: none;">
        Set your password
      </a>
    </p>
    <p style="font-size: 14px; color: #777;">
      If you did not request this, please contact Admin immediately.
    </p></div>`,
              receiver: createdUser.email,
            });

            const notification = {
              title: "ACCOUNT: Your new account has been created!",
              message: `<p>Hi ${user?.firstName},<br><p>Welcome aboard! Your account has been created and now you can start engaging with others through chats, and update your  profile from time to time!</p><p>Here's what you can do:</p><ul><li>Participate in conversations,</li><li>Monitor and update your profile,</li></ul><p>Again, you are most welcome, if you have any question, don't hesitate to contact the admin!</p><div><a href='/dashboard/chat'>Join Conversation</a><a href='/dashboard/profile'>View Profile</a></div><p>We hope you keep having a great time.</p><p>Best Regards,<br>The Admin</p>`,
              receiverId: createdUser?.id,
              opened: false,
              createdAt: new Date(),
            };

            await prisma.notifications.create({
              data: notification,
            });
          } else {
            return res.status(500).json({ message: "Create user failed" });
          }
        })
      );

      const filteredUsers = createdUsers.filter((user) => user !== null);

      return res.status(201).json({
        status: 201,
        message: "Users created successfully",
        data: filteredUsers,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.params;
    const { user, organizationFounded, organizationEmployed } = req.body;
    let organizationFoundedUpdate: any;
    let organizationEmployedUpdate: any;
    let founded: any;
    let employed: any;

    try {
      if (organizationEmployed.id !== "" || organizationFounded.id !== "") {
        founded = await prisma.organization.findFirst({
          where: { id: organizationFounded.id },
        });
        employed = await prisma.organization.findFirst({
          where: { id: organizationEmployed.id },
        });
      } else if (!organizationFounded.id) {
        founded = null;
      } else if (!organizationEmployed.id) {
        employed = null;
      }

      if (founded) {
        organizationFoundedUpdate = await prisma.organization.update({
          where: { id: founded.id },
          data: {
            name: organizationFounded?.name,
            workingSector: {
              connect: {
                id: organizationFounded?.workingSector
                  ? organizationFounded?.workingSector
                  : "unspecified",
              },
            },
            district: {
              connect: {
                name: organizationFounded?.districtId
                  ? organizationFounded?.districtId
                  : "Not Specified",
              },
            },
            sector: {
              connect: {
                id: organizationFounded?.sectorId
                  ? organizationFounded?.sectorId
                  : "unspecified",
              },
            },
            country: {
              connect: {
                id: organizationFounded?.countryId
                  ? organizationFounded?.countryId
                  : "unspecified",
              },
            },
            state: {
              connect: {
                id: organizationFounded?.state
                  ? organizationFounded?.state
                  : "unspecified",
              },
            },
            website: organizationFounded?.website,
          },
        });
      } else {
        organizationFoundedUpdate = await prisma.organization.create({
          data: {
            name: organizationFounded?.name,
            workingSector: {
              connect: {
                id: organizationFounded?.workingSector
                  ? organizationFounded?.workingSector
                  : "unspecified",
              },
            },
            district: {
              connect: {
                name: organizationFounded?.districtId
                  ? organizationFounded?.districtId
                  : "Not Specified",
              },
            },
            sector: {
              connect: {
                id: organizationFounded?.sectorId
                  ? organizationFounded?.sectorId
                  : "unspecified",
              },
            },
            country: {
              connect: {
                id: organizationFounded?.countryId
                  ? organizationFounded?.countryId
                  : "unspecified",
              },
            },
            state: {
              connect: {
                id: organizationFounded?.state
                  ? organizationFounded?.state
                  : "unspecified",
              },
            },
            website: organizationFounded?.website,
          },
        });
      }

      if (employed) {
        organizationEmployedUpdate = await prisma.organization.update({
          where: { id: employed.id },
          data: {
            name: organizationEmployed?.name,
            workingSector: {
              connect: {
                id: organizationEmployed?.workingSector
                  ? organizationEmployed?.workingSector
                  : "unspecified",
              },
            },
            district: {
              connect: {
                name: organizationFounded?.districtId
                  ? organizationFounded?.districtId
                  : "Not Specified",
              },
            },
            sector: {
              connect: {
                id: organizationEmployed?.sectorId
                  ? organizationEmployed?.sectorId
                  : "unspecified",
              },
            },
            country: {
              connect: {
                id: organizationEmployed?.countryId
                  ? organizationEmployed?.countryId
                  : "unspecified",
              },
            },
            state: {
              connect: {
                id: organizationFounded?.state
                  ? organizationFounded?.state
                  : "unspecified",
              },
            },
            website: organizationEmployed?.website,
          },
        });
      } else {
        organizationEmployedUpdate = await prisma.organization.create({
          data: {
            name: organizationEmployed?.name,
            workingSector: {
              connect: {
                id: organizationEmployed?.workingSector
                  ? organizationEmployed?.workingSector
                  : "unspecified",
              },
            },
            district: {
              connect: {
                name: organizationFounded?.districtId
                  ? organizationFounded?.districtId
                  : "Not Specified",
              },
            },
            country: {
              connect: {
                id: organizationEmployed?.countryId
                  ? organizationEmployed?.countryId
                  : "unspecified",
              },
            },
            state: {
              connect: {
                id: organizationFounded?.state
                  ? organizationFounded?.state
                  : "unspecified",
              },
            },
            sector: {
              connect: {
                id: organizationEmployed?.sectorId
                  ? organizationEmployed?.sectorId
                  : "unspecified",
              },
            },
            website: organizationEmployed?.website,
          },
        });
      }

      const userExists = await prisma.user.findFirst({ where: { id: userId } });

      if (!userExists) {
        return res.status(404).json({ message: "User does not exist!" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user?.email,
          residentDistrict: {
            connect: {
              id: user.residentDistrictId
                ? user.residentDistrictId
                : "unspecified",
            },
          },
          residentCountry: {
            connect: {
              id: user.residentCountryId
                ? user.residentCountryId
                : "unspecified",
            },
          },
          state: {
            connect: {
              id: user.state ? user.state : "unspecified",
            },
          },
          residentSector: {
            connect: {
              id: user.residentSectorId ? user.residentSectorId : "unspecified",
            },
          },
          phoneNumber: user.phoneNumber,
          whatsappNumber: user.whatsappNumber,
          gender: {
            connect: {
              name: user.genderName ? user.genderName : "Not Specified",
            },
          },
          nearestLandmark: user.nearestLandmark,
          cohort: {
            connect: {
              id: user?.cohortId ? user?.cohortId : 0,
            },
          },
          track: { connect: { id: user.track ? user.track : "unspecified" } },
          bio: user?.bio || "",
          organizationFounded: {
            connect: { id: organizationFoundedUpdate?.id },
          },
          positionInFounded: user.positionInFounded,
          organizationEmployed: {
            connect: { id: organizationEmployedUpdate?.id },
          },
          positionInEmployed: user.positionInEmployed,
          password: user.password,
          facebook: user?.facebook || "",
          instagram: user?.instagram || "",
          linkedin: user?.linkedin || "",
          twitter: user?.twitter || "",
          profileImage: {
            connect: {
              id: user?.profileImageId ? user?.profileImageId : "default",
            },
          },
          updatedAt: new Date(),
        },
      });

      if (updatedUser) {
        const notification = {
          title: "UPDATED: Your account has been updated!",
          message: `<p>Hi ${user?.firstName},<br><p>Your profile has been updated successfully! It's important to keep your information up to date to help us help you!</p><p>Here's what you can do now:</p><ul><li>Participate in conversations,</li><li>Monitor and update your profile,</li></ul><p>Again, thank you for updating your profile, if you have any question, don't hesitate to contact the admin!</p><div><a href='/dashboard/chat'>Join Conversation</a><a href='/dashboard/profile'>View Profile</a></div><p>We hope you keep having a great time.</p><p>Best Regards,<br>The Admin</p>`,
          receiverId: updatedUser?.id,
          opened: false,
          createdAt: new Date(),
        };

        await prisma.notifications.create({
          data: notification,
        });

        const email = await sendEmail({
          subject: notification.title,
          name: updatedUser.firstName,
          message: `<div><p style="font-size: 16px; line-height: 1.5; color: #333;">
  Your account information has been successfully updated on the Alumni Management System (AMS).
</p>
<p style="font-size: 16px; line-height: 1.5;">
  If you did not make these changes or believe there has been an error, please contact our support team immediately.
</p>
<p style="font-size: 14px; color: #777;">
  Thank you for keeping your profile up to date.
</p></div>`,
          receiver: updatedUser.email,
        });

        return res.status(201).json({
          message: "User updated successfully",
          user: updatedUser,
          ...email,
        });
      } else {
        return res.status(500).json({ message: "Updating user failed" });
      }
    } catch (error: any) {
      console.error(error);
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

export const importUsers = async (req: Request, res: Response) => {
  try {
    const { file }: any = req.files;
    console.log(req.files);
    const errors = [];
    const processedUsers = [];

    if (!file) {
      return res.status(400).send({ message: "No file uploaded." });
    }

    if (
      file.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      fs.unlinkSync(file.tempFilePath);
      return res.status(400).send({ message: "Invalid file selected." });
    }

    const workbook = XLSX.readFile(file.tempFilePath);
    const sheetName = workbook.SheetNames[0];
    const data: any = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return res.status(400).send({ message: "The uploaded file is empty." });
    }

    for (const row of data) {
      try {
        if (row["Email Address"] === "") {
          errors.push({
            message: "This user has no email, skipping!",
            row,
          });
          continue;
        }

        const existingUser = await prisma.user.findFirst({
          where: { email: row["Email Address"] },
        });

        if (existingUser) {
          errors.push({
            message: "This user already exists, skipping!",
            row,
          });
          continue;
        }

        const organizationEmployed = {
          name:
            row["Organization Name (If employed by another organization)"] ||
            "",
          website:
            row["Website of an Organization that Employs you (If available)"] ||
            "",
          country: row["Organization Address (Country)"] || "",
          workingSector: row["Working Sector of your Employer"] || "",
          createdAt: new Date(),
        };
        const organizationFounded = {
          name:
            row[
              "The name of your Initiative (organization you Founded or co-founded)  if Available"
            ] || "",
          website:
            row["Website or any online presence of your initiative"] || "",
          country: row["Country of the initiative (District/Sector)"] || "",
          workingSector:
            row[
              "Main Sector of intervention (Eg: Finance, Education, Agribusiness, Etc)"
            ] || "",
          createdAt: new Date(),
        };

        const user = {
          firstName: row["First name"] || "",
          middleName: row["Middle Name"] || "",
          lastName: row["Second name"] || "",
          email: row["Email Address"] || "",
          phoneNumber: String(row["Your personal Phone number"]) || "",
          whatsappNumber: String(row["Your WhatsApp number"]) || "",
          linkedin: row["LinkedIn Profile Link (https://linkedin.com/in/...)"],
          instagram: row["Instagram Profile Link (https://instagram.com/...)"],
          facebook: row["Facebook Profile Link (https://facebook.com/...)"],
          twitter: row["X (Twitter) Profile Link (https://x.com/...)"],
          genderName: row["Gender"] || "",
          residentCountry: row["Country of Residence"],
          state: row["State (If not in Rwanda)"],
          residentDistrict: row["District of Residence (If in Rwanda)"],
          residentSector: row["Sector of Residence (If in Rwanda)"],
          nearestLandmark:
            row[
              "Nearest Landmark (School, Church, Mosque, Hotel, or any other common known mark)"
            ] || "",
          cohort: row["Cohort"],
          track: row["Track"],
          organizationFounded: organizationFounded.name,
          positionInFounded:
            row[
              "Position with that Organizaton  (Eg: Founder & CEO, Co-Founder &CEO) or other Position"
            ],
          organizationEmployed: organizationEmployed?.name,
          positionInEmployed: row["Position in the organization employing you"],
          roleId: "12",
          createdAt: new Date(),
        };

        const refreshToken = await generateToken(user);

        const [OFWS, OEWS, EC, FC, UC, cohort, track, sector, state] =
          await Promise.all([
            prisma.workingSector.findFirst({
              where: { name: organizationFounded?.workingSector },
            }),
            prisma.workingSector.findFirst({
              where: { name: organizationEmployed?.workingSector },
            }),
            prisma.country.findFirst({
              where: { name: organizationEmployed?.country },
            }),
            prisma.country.findFirst({
              where: { name: organizationFounded?.country },
            }),
            prisma.country.findFirst({
              where: { name: user?.residentCountry },
            }),
            prisma.cohort.findFirst({
              where: { name: String(user?.cohort) },
            }),
            prisma.track.findFirst({
              where: { name: String(user?.track) },
            }),
            prisma.sector.findFirst({
              where: {
                districtName: user?.residentDistrict,
                name: user?.residentSector,
              },
            }),
            prisma.state.findFirst({
              where: {
                country: { name: user?.residentCountry },
                name: user?.state,
              },
            }),
          ]);

        const [OF, OE] = await Promise.all([
          prisma.organization.create({
            data: {
              name: organizationFounded?.name,
              workingSector: {
                connect: {
                  name: OFWS ? OFWS?.name : "Not Specified",
                },
              },
              district: {
                connect: {
                  name: "Not Specified",
                },
              },
              sector: {
                connect: {
                  id: "unspecified",
                },
              },
              country: {
                connect: {
                  id: FC?.id ? FC?.id : "unspecified",
                },
              },
              website: organizationFounded?.website,
            },
          }),
          prisma.organization.create({
            data: {
              name: organizationEmployed?.name,
              workingSector: {
                connect: {
                  name: OEWS ? OEWS?.name : "Not Specified",
                },
              },
              country: {
                connect: {
                  id: EC?.id ? EC?.id : "unspecified",
                },
              },
              website: organizationEmployed?.website,
            },
          }),
        ]);

        const US = await prisma.user.create({
          data: {
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            residentCountry: {
              connect: {
                name: UC ? UC?.name : "Not Specified",
              },
            },
            residentDistrict: {
              connect: {
                name: user.residentDistrict
                  ? user?.residentDistrict
                  : "Not Specified",
              },
            },
            residentSector: {
              connect: {
                id: sector?.id ? sector?.id : "unspecified",
              },
            },
            phoneNumber: user.phoneNumber,
            whatsappNumber: user.whatsappNumber,
            gender: {
              connect: {
                name: user.genderName ? user?.genderName : "Not Specified",
              },
            },
            nearestLandmark: user.nearestLandmark,
            cohort: { connect: { id: cohort?.id ? cohort?.id : 0 } },
            track: {
              connect: { id: track?.id ? track?.id : "unspecified" },
            },
            organizationFounded: {
              connect: { id: OF.id },
            },
            positionInFounded: user.positionInFounded,
            organizationEmployed: {
              connect: { id: OE.id },
            },
            state: {
              connect: {
                id: state?.id ? state?.id : "unspecified",
              },
            },
            role: {
              connect: {
                id: user?.roleId ? user?.roleId : "12",
              },
            },
            positionInEmployed: user.positionInEmployed,
            refreshToken: refreshToken,
            facebook: user?.facebook,
            instagram: user?.instagram,
            linkedin: user?.linkedin,
            twitter: user?.twitter,
            createdAt: new Date(),
          },
        });

        processedUsers.push(US);

        const email = await sendEmail({
          subject: "Your profile on YALI AMS created successfully!",
          name: US.firstName,
          message: `<div><p style="font-size: 16px; line-height: 1.5; color: #333;">
  Your profile has been successfully created on YALI Alumni Management System (AMS). Please use the link below to set your password:
</p>
<p style="font-size: 16px; line-height: 1.5;">
  <a href="${process.env.FRONTEND_URL}/reset-password/${US.refreshToken}" style="color: #0073e6; text-decoration: none;">
    Set your password
  </a>
</p>
<p style="font-size: 14px; color: #777;">
  If you did not request this, please contact Admin immediately.
</p></div>`,
          receiver: US.email,
        });

        await prisma.notifications.create({
          data: {
            title: "ACCOUNT: Your new account has been created!",
            message: `<p>Hi ${user?.firstName},<br><p>Welcome aboard! Your account has been created and now you can start engaging with others through chats, and update your  profile from time to time!</p><p>Here's what you can do:</p><ul><li>Participate in conversations,</li><li>Monitor and update your profile,</li></ul><p>Again, you are most welcome, if you have any question, don't hesitate to contact the admin!</p><div><a href='/dashboard/chat'>Join Conversation</a><a href='/dashboard/profile'>View Profile</a></div><p>We hope you keep having a great time.</p><p>Best Regards,<br>The Admin</p>`,
            receiverId: US?.id,
            opened: false,
            createdAt: new Date(),
          },
        });
      } catch (err: any) {
        errors.push({ message: err.message, row });
      }
    }

    return res.status(201).send({
      message: "Users uploaded and processed successfully!",
      processedUsers,
      errors,
    });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "An error occurred during processing.", error });
  }
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
      "Last Updated At": user?.updatedAt || "",
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
