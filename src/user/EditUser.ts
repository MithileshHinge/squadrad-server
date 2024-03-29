import ValidationError from '../common/errors/ValidationError';
import { removeUndefinedKeys } from '../common/helpers';
import { validateUserId } from '../userId';
import { IUsersData } from './IUsersData';
import { IUserValidator } from './validator/IUserValidator';

export default class EditUser {
  private usersData: IUsersData;

  private userValidator: IUserValidator;

  constructor(usersData: IUsersData, userValidator: IUserValidator) {
    this.usersData = usersData;
    this.userValidator = userValidator;
  }

  /**
   * EditUser use case: Only allowed fields can be edited. userId must be provided.
   * @throws ValidationError if invalid parameters are provided
   * @throws DatabaseError if operation fails
   */
  async edit(userInfo: { userId: string, fullName?: string }): Promise<{
    userId: string,
    fullName?: string,
  }> {
    const userIdValidated = validateUserId.validate(userInfo.userId);
    const fullNameValidated = userInfo.fullName === undefined
      ? undefined
      : this.userValidator.validateFullName(userInfo.fullName);
    const userToUpdate = {
      userId: userIdValidated,
      fullName: fullNameValidated,
    };

    removeUndefinedKeys(userToUpdate);

    if (Object.keys(userToUpdate).length <= 1) throw new ValidationError('Nothing to update');
    const userEdited = await this.usersData.updateUser(userToUpdate);
    return {
      userId: userEdited.userId,
      fullName: userEdited.fullName,
    };
  }
}
