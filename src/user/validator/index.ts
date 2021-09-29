import ValidationError from '../../common/errors/ValidationError';
import stringValidator from '../../common/validators/stringValidator';
import { IUserValidator } from './IUserValidator';

const userValidator: IUserValidator = {
  validateFullName(fullName: string): string {
    const fullNameTrimmed = fullName.trim();
    if (!stringValidator.minLength(fullNameTrimmed, 3)) throw new ValidationError(`Full name "${fullNameTrimmed}" must have at least 3 letters`);
    if (!stringValidator.maxLength(fullNameTrimmed, 50)) throw new ValidationError(`Full name "${fullNameTrimmed}" cannot be longer than 50 characters`);
    if (fullNameTrimmed.includes('  ')) throw new ValidationError(`Full name "${fullNameTrimmed}" cannot contain two consecutive spaces`);
    if (!stringValidator.isAlphaAndSpaces(fullNameTrimmed)) throw new ValidationError(`Full name "${fullNameTrimmed}" must only contain letters and spaces`);
    return fullNameTrimmed;
  },

  validateEmail(email: string): string {
    const emailTrimmed = email.trim();
    if (stringValidator.isEmail(emailTrimmed)) return emailTrimmed;
    throw new ValidationError(`Email "${emailTrimmed}" is not valid`);
  },

  validatePassword(password: string): string {
    if (stringValidator.minLength(password, 8)) return password;
    throw new ValidationError('Password must of at least 8 characters');
  },
};

export default userValidator;
