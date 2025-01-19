import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendEmail from "../../helpers/sendMail";
import { generateToken } from "../../helpers/auth";
import { notificationTypes } from "../notificationController";

const prisma = new PrismaClient();

export const importUsers = async (req: Request, res: Response) => {
  try {
    const { selectedData }: any = req.body;
    const errors: any = [];
    const processedUsers: any = [];
    const bulkOrganizations = [];
    const bulkUsers = [];
    const failedUsers: any = [];

    const notificationToSend = await prisma.notificationSetup.findFirst({
      where: { usage: notificationTypes.SIGNUP },
    });

    for (let item of selectedData) {
      try {
        if (item?.email === "") {
          errors.push({
            message: "Member " + item?.firstName + " has no email, skipping!",
            item,
          });
          failedUsers.push(item);
          continue;
        }

        const existingUser = await prisma.user.findFirst({
          where: { email: item?.email },
        });

        if (existingUser) {
          errors.push({
            message: "Member " + item?.email + " already exists, skipping!",
            item,
          });
          continue;
        }

        const organizationEmployed = {
          name: item?.employerName,
          website: item?.employerWebsite,
          country: {
            connect: {
              name: item?.employerAddress,
            },
          },
          workingSector: {
            connect: {
              id: "unspecified",
            },
          },
          createdAt: new Date(),
        };
        const organizationFounded = {
          name: item?.initiativeName,
          website: item?.initiativeWebsite,
          country: {
            connect: {
              name: item?.initiativeAddress,
            },
          },
          workingSector: {
            connect: {
              name: item?.initiativeSector,
            },
          },
          createdAt: new Date(),
        };

        const user = {
          firstName: item?.firstName,
          middleName: item?.middleName,
          lastName: item?.lastName,
          email: item?.email,
          phoneNumber: String(item?.phoneNumber),
          whatsappNumber: String(item?.whatsappNumber),
          linkedin: item?.linkedin,
          instagram: item?.instagram,
          facebook: item?.facebook,
          twitter: item?.twitter,
          genderName: item?.gender,
          residentCountry: item?.residentCountry,
          state: item?.state,
          residentDistrict: item?.residentDistrict,
          residentSector: item?.residentSector,
          nearestLandmark: item?.nearestLandmark,
          cohort: item?.cohort,
          track: item?.track,
          organizationFounded: organizationFounded.name,
          positionInFounded: item?.initiativePosition,
          organizationEmployed: organizationEmployed?.name,
          positionInEmployed: item?.employerPosition,
          roleId: "12",
          createdAt: new Date(),
        };

        const refreshToken = await generateToken(user);

        const [OFWS, EC, FC, UC, cohort, track, sector, state] =
          await Promise.all([
            prisma.workingSector.findFirst({
              where: { name: item?.initiativeSector },
            }),
            prisma.country.findFirst({
              where: { name: item?.employerAddress },
            }),
            prisma.country.findFirst({
              where: { name: item?.initiativeAddress },
            }),
            prisma.country.findFirst({
              where: { name: item?.residentCountry },
            }),
            prisma.cohort.findFirst({
              where: { name: String(item?.cohort) },
            }),
            prisma.track.findFirst({
              where: { name: String(item?.track) },
            }),
            prisma.sector.findFirst({
              where: {
                districtName: item?.residentDistrict,
                name: item?.residentSector,
              },
            }),
            prisma.state.findFirst({
              where: {
                name: item?.state,
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
                  name: "Not Specified",
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
            cohort: { connect: { id: cohort?.id ? cohort?.id : 1 } },
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

        const notification = {
          title: "ACCOUNT: Your new account has been created!",
          message: notificationToSend!.message.replace(
            /\[name\]/g,
            item?.firstName
          ),
          receiverId: US?.id,
          opened: false,
          createdAt: new Date(),
        };

        await prisma.notifications.create({
          data: notification,
        });
      } catch (err: any) {
        errors.push({ message: err.message, item });
      }
    }

    return res.status(201).send({
      message: "Users uploaded and processed successfully!",
      processedUsers,
      errors,
      failedUsers,
    });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "An error occurred during processing.", error });
  }
};
