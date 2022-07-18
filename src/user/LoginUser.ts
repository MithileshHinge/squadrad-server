import AuthenticationError from '../common/errors/AuthenticationError';
import ValidationError from '../common/errors/ValidationError';
import GetProfilePic from '../profile-pic/GetProfilePic';
import { IUsersData } from './IUsersData';
import { IPasswordEncryption } from './password/IPasswordEncryption';
import VerifyEmail from './VerifyEmail';

export default class LoginUser {
  private getProfilePic: GetProfilePic;

  private verifyEmail: VerifyEmail;

  private usersData: IUsersData;

  private passwordEncryption: IPasswordEncryption;

  constructor(getProfilePic: GetProfilePic, verifyEmail: VerifyEmail, usersData: IUsersData, passwordEncryption: IPasswordEncryption) {
    this.getProfilePic = getProfilePic;
    this.verifyEmail = verifyEmail;
    this.usersData = usersData;
    this.passwordEncryption = passwordEncryption;
  }

  async login({ email, password }: {
    email: string,
    password: string,
  }) {
    const user = await this.usersData.fetchUserByEmail(email);
    if (!user) throw new AuthenticationError(`User with email "${email}" does not exist`);
    if (!user.verified) throw new ValidationError('Email not verified');
    const passwordHash = await this.usersData.fetchPasswordById(user.userId);
    if (!this.passwordEncryption.compare(password, passwordHash)) throw new AuthenticationError('Incorrect credentials');

    const profilePicSrc = await this.getProfilePic.get(user.userId, false);
    // TODO: set lastLoginAt timestamp in database

    return {
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      profilePicSrc,
    };
  }

  /**
   * Trusted login use case
   * This use case assumes user has been authenticated by other method, does not require password.
   * If user has signed up with password, and email is not verified, this use case will verify email.
   * WARNING: To be used only by OAuth login service (Passport - Google/Youtube/etc)
   */
  async loginWithOAuth({ email }: {
    email: string,
  }) {
    const user = await this.usersData.fetchUserByEmail(email);
    if (!user) throw new AuthenticationError(`User with email "${email}" does not exist`);
    if (!user.verified) {
      await this.verifyEmail.verifyManually(user.userId);
    }

    const profilePicSrc = await this.getProfilePic.get(user.userId, false);
    // TODO: set lastLoginAt timestamp in database

    return {
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      profilePicSrc,
    };
  }
}
