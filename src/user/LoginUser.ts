import AuthenticationError from '../common/errors/AuthenticationError';
import ValidationError from '../common/errors/ValidationError';
import { IUsersData } from './IUsersData';
import { IPasswordEncryption } from './password/IPasswordEncryption';

export default class LoginUser {
  usersData: IUsersData;

  passwordEncryption: IPasswordEncryption;

  constructor(usersData: IUsersData, passwordEncryption: IPasswordEncryption) {
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

    // TODO: set lastLoginAt timestamp in database

    return {
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
      profilePicSrc: user.profilePicSrc,
    };
  }
}
