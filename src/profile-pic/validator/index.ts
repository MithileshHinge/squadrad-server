import ValidationError from '../../common/errors/ValidationError';
import fileValidator from '../../common/validators/fileValidator';
import { IProfilePicValidator } from './IProfilePicValidator';

const profilePicValidator: IProfilePicValidator = {
  validateProfilePic(src: string): string {
    if (typeof src !== 'string') throw new ValidationError('Profile pic src must be a string');
    const srcValidated = src.trim();
    if (!fileValidator.fileExists(srcValidated)) throw new ValidationError(`File ${srcValidated} does not exist`);
    if (!fileValidator.fileIsJPEGImage(srcValidated)) throw new ValidationError(`File ${srcValidated} is not a JPEG image`);
    return srcValidated;
  },
};

export default profilePicValidator;
