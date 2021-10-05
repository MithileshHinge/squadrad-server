import { issueJWT, verifyJWT } from '../../common/jwt';
import sendMail from '../../mail';
import handleMailError from '../../mail/MailErrorHandler';
import { IEmailVerification } from './IEmailVerification';

const emailVerification: IEmailVerification = {
  async sendVerificationMail(to: string): Promise<any> {
    const emailVerificationToken = issueJWT({ email: to }, 86400);
    const subject = 'Please verify your email address | Squadrad';
    const bodyText = `Hi, please verify your email address and let's get you onboard. Follow this link to complete verification: http://localhost:8080/auth/verify-email/check?token=${emailVerificationToken}`;
    const bodyHtml = `Hi, please verify your email address and let's get you onboard. Follow this link to complete verification: http://localhost:8080/auth/verify-email/check?token=${emailVerificationToken}`;

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
