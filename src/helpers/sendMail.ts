import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { Email } from "../Types/email";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const loadTemplate = (templateName: string, replacements: any) => {
  const filePath = path.join(`${templateName}.html`);
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const htmlToSend = template(replacements);
  return htmlToSend;
};

async function sendEmail(replacements: Email) {
  const htmlTemplate = loadTemplate("emailTemplate", replacements);

  try {
    const info = await transporter.sendMail({
      from: `"Alumni Management System" <${process.env.EMAIL_USERNAME}>`,
      to: replacements?.receiver,
      subject: replacements?.subject,
      html: htmlTemplate,
    });

    return { status: 200, messageId: info.messageId };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
}

export default sendEmail;
