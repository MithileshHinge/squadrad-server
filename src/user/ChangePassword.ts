import AuthenticationError from '../common/errors/AuthenticationError';
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
   * Change password use case: Compares passwords, encrypts new password and stores the hash
   * @throws AuthenticationError if oldPassword does not match
   * @throws ValidationError if newPassword is invalid
   * @throws DatabaseError if operation fails
   */
  async change(userId: string, oldPassword: string, newPassword: string) {
    const userIdValidated = this.userValidator.validateUserId(userId);
    const oldPasswordValidated = this.userValidator.validatePassword(oldPassword);
    const oldPasswordHash = await this.usersData.fetchPasswordById(userIdValidated);
    if (!this.passwordEncryption.compare(oldPasswordValidated, oldPasswordHash)) throw new AuthenticationError('Old password is incorrect');
    const passwordValidated = this.userValidator.validatePassword(newPassword);
    const passwordHash = this.passwordEncryption.encrypt(passwordValidated);
    await this.usersData.updatePassword(userIdValidated, passwordHash);
  }
}
