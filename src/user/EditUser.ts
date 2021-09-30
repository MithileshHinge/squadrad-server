import { IUserData } from './IUserData';
import { IUserValidator } from './validator/IUserValidator';

export default class EditUser {
  private userData: IUserData;

  private userValidator: IUserValidator;

  constructor(userData: IUserData, userValidator: IUserValidator) {
    this.userData = userData;
    this.userValidator = userValidator;
  }

  /**
   * EditUser use case: Only allowed fields can be edited. userId must be provided.
   * @throws ValidationError if invalid parameters are provided
   * @throws DatabaseError if operation fails
   */
  edit(userInfo: { userId: string, fullName?: string }) {
    const fullNameValidated = userInfo.fullName === undefined
      ? undefined
      : this.userValidator.validateFullName(userInfo.fullName);
    const userToUpdate = {
      userId: userInfo.userId,
      fullName: fullNameValidated,
    };
    this.userData.updateUser(userToUpdate);
  }
}
