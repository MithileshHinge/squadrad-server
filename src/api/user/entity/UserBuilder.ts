import { IId } from '../../../services/id';
import { IValidationService } from '../../../services/validation-service/IValidationService';
import { IEncryptionService } from '../../../services/encryption-service/IEncryptionService';
import ValidationError from '../../common/errors/ValidationError';
import { IUser } from './IUser';

export default class UserBuilder {
  id: IId;

  validationService: IValidationService;

  encryptionService: IEncryptionService;

  constructor(
    id: IId,
    validationService: IValidationService,
    encryptionService: IEncryptionService,
  ) {
    this.id = id;
    this.validationService = validationService;
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
    let fullNameValidated = this.validationService.validateFullName(fullName);
    const emailValidated = this.validationService.validateEmail(email);
    let passwordValidated: string;
    let passwordHash: string;
    if (password === '') {
      throw new ValidationError('password is not provided');
    } else if (password) {
      passwordValidated = this.validationService.validatePassword(password);
      passwordHash = this.encryptionService.encrypt(passwordValidated);
    }
    const user: IUser = {
      getId: () => userIdValidated,
      getFullName: () => fullNameValidated,
      getEmail: () => emailValidated,
      getPassword: () => passwordHash,
      setFullName: (newFullName) => {
        fullNameValidated = this.validationService.validateFullName(newFullName);
      },
      setPassword: (newPassword) => {
        passwordValidated = this.validationService.validatePassword(newPassword);
        passwordHash = this.encryptionService.encrypt(passwordValidated);
      },
    } as const;
    return user;
  }
}
