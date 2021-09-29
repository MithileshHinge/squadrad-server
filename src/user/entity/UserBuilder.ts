import { IId } from '../id';
import { IUserValidator } from '../validator/IUserValidator';
import { IPasswordEncryption } from '../password/IPasswordEncryption';
import ValidationError from '../../common/errors/ValidationError';
import { IUser } from './IUser';
import profilePicBuilder from '../../profile-pic/entity';

export default class UserBuilder {
  id: IId;

  userValidator: IUserValidator;

  passwordEncryption: IPasswordEncryption;

  constructor(
    id: IId,
    userValidator: IUserValidator,
    passwordEncryption: IPasswordEncryption,
  ) {
    this.id = id;
    this.userValidator = userValidator;
    this.passwordEncryption = passwordEncryption;
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
      : this.userValidator.validateFullName(fullName);
    const emailValidated = (email === undefined)
      ? null
      : this.userValidator.validateEmail(email);
    const passwordValidated = (password === undefined)
      ? null
      : this.userValidator.validatePassword(password);
    const passwordHash = (passwordValidated === null)
      ? null
      : this.passwordEncryption.encrypt(passwordValidated);

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
