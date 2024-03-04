import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: String(process.env.GMAIL_APP_MAIL),
    pass: String(process.env.GMAIL_APP_PASSWORD),
  },
});

export function sendMail(
  to?: string | null,
  subject?: string,
  text?: string,
  isHtml = false
) {

  if(!to) {
    return;
  }

  const msg = isHtml
    ? {
        html: text,
      }
    : {
        text,
      };

  return transporter.sendMail({
    to,
    subject,
    ...msg,
  });
}
