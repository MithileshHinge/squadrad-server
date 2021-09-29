import { accessSync, constants } from 'fs';
import validator from 'validator';
import ValidationError from '../../common/errors/ValidationError';
import { IValidationService } from './IValidationService';

const validationService: IValidationService = {
  validateFullName(fullName: string): string {
    const fullNameTrimmed = fullName.trim();
    if (!this.minLength(fullNameTrimmed, 3)) throw new ValidationError(`Full name "${fullNameTrimmed}" must have at least 3 letters`);
    if (!this.maxLength(fullNameTrimmed, 50)) throw new ValidationError(`Full name "${fullNameTrimmed}" cannot be longer than 50 characters`);
    if (fullNameTrimmed.includes('  ')) throw new ValidationError(`Full name "${fullNameTrimmed}" cannot contain two consecutive spaces`);
    if (!this.isAlphaAndSpaces(fullNameTrimmed)) throw new ValidationError(`Full name "${fullNameTrimmed}" must only contain letters and spaces`);
    return fullNameTrimmed;
  },

  validateEmail(email: string): string {
    const emailTrimmed = email.trim();
    if (validator.isEmail(emailTrimmed)) return emailTrimmed;
    throw new ValidationError(`Email "${emailTrimmed}" is not valid`);
  },

  validatePassword(password: string): string {
    if (this.minLength(password, 8)) return password;
    throw new ValidationError('Password must of at least 8 characters');
  },

  validateProfilePic(src: string): string {
    const srcValidated = src.trim();
    try {
      accessSync(srcValidated, constants.F_OK);
      return srcValidated;
    } catch (err) {
      throw new ValidationError(`File ${srcValidated} does not exist`);
    }
  },

  minLength(str: string, len: number): boolean {
    return validator.isLength(str, { min: len });
  },

  maxLength(str: string, len: number): boolean {
    return validator.isLength(str, { max: len });
  },

  isAlphaAndSpaces(str: string): boolean {
    return validator.isAlpha(str, undefined, { ignore: ' ' });
  },
};

export default validationService;
