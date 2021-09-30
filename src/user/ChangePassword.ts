import { IUsersData } from './IUsersData';
import { IPasswordEncryption } from './password/IPasswordEncryption';
import { IUserValidator } from './validator/IUserValidator';

export default class ChangePassword {
  private usersData: IUsersData;

  private userValidator: IUserValidator;

  private passwordEncryption: IPasswordEncryption;

  constructor(
    usersData: IUsersData,
    userValidator: IUserValidator,
    passwordEncryption: IPasswordEncryption,
  ) {
    this.usersData = usersData;
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
    this.usersData.updatePassword(userId, passwordHash);
  }
}
