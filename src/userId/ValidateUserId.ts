import { IUserIdValidator } from './validator/IUserIdValidator';

export default class ValidateUserId {
  private userIdValidator: IUserIdValidator;

  constructor(userIdValidator: IUserIdValidator) {
    this.userIdValidator = userIdValidator;
  }

  /**
   * Checks if userId is of type string, and is a 12 byte hex string
   * @throws ValidationError if userId is invalid
   */
  validate(userId: string) {
    return this.userIdValidator.validateUserId(userId);
  }
}
