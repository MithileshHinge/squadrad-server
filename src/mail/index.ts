import nodemailer from 'nodemailer';
import { MAIL_USER, MAIL_PASSWORD } from '../common/secretKeys';

const transporter = nodemailer.createTransport({
  host: 'smtppro.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

export default async function sendMail(
  to: string,
  subject: string,
  bodyText: string,
  bodyHtml: string,
) {
  const mailOptions = {
    from: `"Team Squadrad" <${MAIL_USER}>`,
    to,
    subject,
    text: bodyText,
    html: bodyHtml,
  };
  const result = await transporter.sendMail(mailOptions);
  console.log(`Message ${result.messageId} sent: ${result.response}`);
  return result;
}

/**
 * Only for testing purpose
 */
export function closeMailTransporter() {
  transporter.close();
}
