import { IId } from '../../services/id';
import { IValidationService } from '../../services/validation-service/IValidationService';
import { IEncryptionService } from '../../services/encryption-service/IEncryptionService';
import ValidationError from '../../common/errors/ValidationError';
import { IUser } from './IUser';
import profilePicBuilder from '../../profile-pic/entity';

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
  }:{ userId?: string, fullName?: string, email?: string, password?: string }): IUser {
    if (!this.id.isValidId(userId)) {
      throw new ValidationError('userId is not valid');
    }
    const userIdValidated = userId;
    const fullNameValidated = (fullName === undefined)
      ? null
      : this.validationService.validateFullName(fullName);
    const emailValidated = (email === undefined)
      ? null
      : this.validationService.validateEmail(email);
    const passwordValidated = (password === undefined)
      ? null
      : this.validationService.validatePassword(password);
    const passwordHash = (passwordValidated === null)
      ? null
      : this.encryptionService.encrypt(passwordValidated);

    const user: IUser = {
      getId: () => userIdValidated,
      getFullName: fullNameValidated ? () => fullNameValidated : undefined,
      getEmail: emailValidated ? () => emailValidated : undefined,
      getPassword: passwordHash ? () => passwordHash : undefined,
      getProfilePic: () => {
        // TODO: change default profile pic implementation
        const profilePic = profilePicBuilder.build('default.jpg');
        return profilePic.getSrc();
      },
    } as const;
    return user;
  }
}
