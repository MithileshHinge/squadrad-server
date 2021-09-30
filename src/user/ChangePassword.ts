import { IUserData } from './IUserData';
import { IPasswordEncryption } from './password/IPasswordEncryption';
import { IUserValidator } from './validator/IUserValidator';

export default class ChangePassword {
  userData: IUserData;

  userValidator: IUserValidator;

  passwordEncryption: IPasswordEncryption;

  constructor(
    userData: IUserData,
    userValidator: IUserValidator,
    passwordEncryption: IPasswordEncryption,
  ) {
    this.userData = userData;
    this.userValidator = userValidator;
    this.passwordEncryption = passwordEncryption;
  }

  /**
   * Change password. Does not handle encryption, please ensure password is
   * being stored in encrypted form
   * @throws ValidationError if newPassword is invalid
   * @throws DatabaseError if operation fails
   */
  change(userId: string, newPassword: string) {
    const passwordValidated = this.userValidator.validatePassword(newPassword);
    const passwordHash = this.passwordEncryption.encrypt(passwordValidated);
    this.userData.updatePassword(userId, passwordHash);
  }
}
