import { createTransport } from "nodemailer";

export const transporter = createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: String(process.env.GMAIL_APP_MAIL),
    pass: String(process.env.GMAIL_APP_PASSWORD),
  },
});


