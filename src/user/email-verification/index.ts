import { issueJWT, verifyJWT } from '../../common/jwt';
import sendMail from '../../mail';
import handleMailError from '../../mail/MailErrorHandler';
import { IEmailVerification } from './IEmailVerification';

const emailVerification: IEmailVerification = {
  async sendVerificationMail(to: string): Promise<any> {
    const emailVerificationToken = issueJWT({ email: to }, 86400);
    const subject = 'Please verify your email address | Squadrad';
    const bodyHtml = `<div style="background-color: #1c1f33; text-align: center; padding-top: 96px; padding-bottom: 32px; padding-left: 32px; padding-right: 32px;">
      <img src="${process.env.NODE_ENV === 'production' ? 'https://squadrad.com' : 'http://localhost:8080'}/images/squadrad-logo-with-name.png" style="width: 192px;">
      <div style="color: #f9f9fa; font-size: 18px; margin: 48px; text-align: center;">
        Hi, let's get you onboard! Just click the button below to verify your email.
      </div>
      <a
      href="${process.env.NODE_ENV === 'production' ? 'https://squadrad.com' : 'http://localhost:8080'}/auth/verify-email/check?token=${emailVerificationToken}"
      target="_blank"
      style="color: #f9f9fa; text-decoration: none; font-size: 16px; padding: 16px 48px; border-radius: 80px; background-image: linear-gradient(35deg, #ff3d77, #bb57a4);"
      >
        Verify email
      </a>
      <div style="margin-top: 96px; font-size: 10px; color: white;">
        If the above button does not work, please follow this link to complete verification: <a href="${process.env.NODE_ENV === 'production' ? 'https://squadrad.com' : 'http://localhost:8080'}/auth/verify-email/check?token=${emailVerificationToken}" target="_blank" style="color: #ff3d77;">
        ${process.env.NODE_ENV === 'production' ? 'https://squadrad.com' : 'http://localhost:8080'}/auth/verify-email/check?token=${emailVerificationToken}
        </a>
      </div>
    </div>`;
    const bodyText = `Hi, please verify your email address and let's get you onboard. Follow this link to complete verification: ${process.env.NODE_ENV === 'production' ? 'https://squadrad.com' : 'http://localhost:8080'}/auth/verify-email/check?token=${emailVerificationToken}`;

    try {
      const result = await sendMail(to, subject, bodyText, bodyHtml);
      return result;
    } catch (mailError) {
      return handleMailError(mailError, 'Could not send verification email');
    }
  },

  async verifyEmailToken(token: string) {
    const data = await verifyJWT(token);
    return {
      email: data.email,
    };
  },
};

export default emailVerification;
