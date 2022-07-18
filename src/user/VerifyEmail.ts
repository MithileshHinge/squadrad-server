import ValidationError from '../common/errors/ValidationError';
import { IEmailVerification } from './email-verification/IEmailVerification';
import { IUsersData } from './IUsersData';
import { IUserValidator } from './validator/IUserValidator';

export default class VerifyEmail {
  private usersData: IUsersData;

  private userValidator: IUserValidator;

  private emailVerification: IEmailVerification;

  constructor(usersData: IUsersData, userValidator: IUserValidator, emailVerification: IEmailVerification) {
    this.usersData = usersData;
    this.userValidator = userValidator;
    this.emailVerification = emailVerification;
  }

  async verify(token: string) {
    const tokenValidated = this.userValidator.validateToken(token);
    const { email } = await this.emailVerification.verifyEmailToken(tokenValidated);
    const user = await this.usersData.fetchUserByEmail(email);
    if (!user) throw new ValidationError(`User with email "${email}"" does not exist`);

    await this.usersData.updateUser({ userId: user.userId, verified: true });
  }

  /**
   * Manually sets user verified to true, assumes email is already verified by other methods such as OAuth (google, facebook, etc)
   * WARNING: To be used only by OAuth login service (Passport - Google/Youtube/etc)
   * @param userId Id of the user
   */
  async verifyManually(userId: string) {
    await this.usersData.updateUser({ userId, verified: true });
  }
}
