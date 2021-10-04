import { IEmailVerification } from '../../../user/email-verification/IEmailVerification';

const mockEmailVerification: IEmailVerification = {
  sendVerificationMail: jest.fn(),
};

export default mockEmailVerification;
