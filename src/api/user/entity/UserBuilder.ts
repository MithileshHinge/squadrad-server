import { IId } from '../../services/id';
import { IValidationHelper } from '../../services/validation-helper/IValidationHelper';
import { IEncryptionService } from '../../services/encryption-service/IEncryptionService';
import ValidationError from '../../common/errors/ValidationError';
import { IUser } from './IUser';

export default class UserBuilder {
  id: IId;

  validationHelper: IValidationHelper;

  encryptionService: IEncryptionService;

  constructor(id: IId, validationHelper: IValidationHelper, encryptionService: IEncryptionService) {
    this.id = id;
    this.validationHelper = validationHelper;
    this.encryptionService = encryptionService;
  }

  /**
   * Build a user entity from given user info, validating each field.
   * @throws ValidationError if invalid parameters are provided
   * @returns A validated IUser entity instance
   */
  build({
    userId = this.id.createId(),
    fullName,
    email,
    password,
  }:{ userId?: string, fullName: string, email: string, password?: string }): IUser {
    if (!this.id.isValidId(userId)) {
      throw new ValidationError('userId is not valid');
    }
    const userIdValidated = userId;
    let fullNameValidated = this.validationHelper.validateFullName(fullName);
    const emailValidated = this.validationHelper.validateEmail(email);
    let passwordValidated: string;
    let passwordHash: string;
    if (password === '') {
      throw new ValidationError('password is not provided');
    } else if (password) {
      passwordValidated = this.validationHelper.validatePassword(password);
      passwordHash = this.encryptionService.encrypt(passwordValidated);
    }
    const user: IUser = {
      getId: () => userIdValidated,
      getFullName: () => fullNameValidated,
      getEmail: () => emailValidated,
      getPassword: () => passwordHash,
      setFullName: (newFullName) => {
        fullNameValidated = this.validationHelper.validateFullName(newFullName);
      },
      setPassword: (newPassword) => {
        passwordValidated = this.validationHelper.validatePassword(newPassword);
        passwordHash = this.encryptionService.encrypt(passwordValidated);
      },
    } as const;
    return user;
  }
}
