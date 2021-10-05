import ValidationError from '../common/errors/ValidationError';
import { IEmailVerification } from './email-verification/IEmailVerification';
import { IUsersData } from './IUsersData';

export default class VerifyEmail {
  private usersData: IUsersData;

  private emailVerification: IEmailVerification;

  constructor(usersData: IUsersData, emailVerification: IEmailVerification) {
    this.usersData = usersData;
    this.emailVerification = emailVerification;
  }

  async verify(token: string) {
    const { email } = await this.emailVerification.verifyEmailToken(token);
    const user = await this.usersData.fetchUserByEmail(email);
    if (!user) throw new ValidationError(`User with email "${email}"" does not exist`);

    await this.usersData.updateUser({ userId: user.userId, verified: true });
  }
}
