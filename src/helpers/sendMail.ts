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

// const loadTemplate = (templateName: string, replacements: any) => {
//   const filePath = path.join(`${templateName}.html`);
//   const source = fs.readFileSync(filePath, "utf-8").toString();
//   const template = handlebars.compile(source);
//   const htmlToSend = template(replacements);
//   return htmlToSend;
// };

async function sendEmail(replacements: Email) {

  try {
    const info = await transporter.sendMail({
      from: `"Alumni Management System" <${process.env.EMAIL_USERNAME}>`,
      to: replacements?.receiver,
      subject: replacements?.subject,
      html: `
    <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
          <!-- Header -->
          <header style="background-color: #2FC1FF; color: white; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">YALI Alumni Management System</h1>
          </header>

          <!-- Content -->
          <div style="padding: 20px;">
            <p style="font-size: 16px; line-height: 1.5; color: #333;">Hello ${
              replacements?.name
            },</p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              ${replacements?.message}
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">Best regards,<br>Admin.</p>
          </div>

          <!-- Footer -->
          
          <footer style="background-color: #f4f4f4; padding: 10px; text-align: center; color: #777; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Alumni Management System. All rights reserved.</p>
            <p style="margin: 0; font-size: 12px;">
              <a href="#" style="color: #0073e6; text-decoration: none;">Unsubscribe</a> | 
              <a href="#" style="color: #0073e6; text-decoration: none;">Privacy Policy</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  `,
    });

    return { status: 200, messageId: info.messageId };
  } catch (error: any) {
    return { status: 500, message: error.message };
  }
}

export default sendEmail;
