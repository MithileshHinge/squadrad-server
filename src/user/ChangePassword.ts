import ValidationError from '../common/errors/ValidationError';
import userBuilder from './entity';
import { IUserData } from './IUserData';

export default class ChangePassword {
  userData: IUserData;

  constructor(userData: IUserData) {
    this.userData = userData;
  }

  /**
   * Change password. Does not handle encryption, please ensure password is
   * being stored in encrypted form
   * @throws ValidationError if userId does not exist or newPassword is invalid
   * @throws DatabaseError if operation fails
   */
  change(userId: string, newPassword: string) {
    const userExisting = this.userData.fetchUserById(userId);
    if (!userExisting) throw new ValidationError(`User with userId "${userId}" does not exist`);
    const user = userBuilder.build({
      userId,
      password: newPassword,
    });
    this.userData.updatePassword(userId, user.getPassword!());
  }
}
