import ValidationError from '../../common/errors/ValidationError';
import stringValidator from '../../common/validators/stringValidator';
import { IPostValidator } from './IPostValidator';

const postValidator: IPostValidator = {
  validateTitle(title: string): string {
    if (typeof title !== 'string') throw new ValidationError('Post title must be a string');
    const titleTrimmed = title.trim();
    if (!stringValidator.minLength(titleTrimmed, 3)) throw new ValidationError(`Post title ${titleTrimmed} must have at least 3 letters`);
    if (!stringValidator.maxLength(titleTrimmed, 50)) throw new ValidationError(`Post title ${titleTrimmed} must not be longer than 50 characters`);
    return titleTrimmed;
  },
  validateDescription(description: string): string {
    if (typeof description !== 'string') throw new ValidationError('Post description must be a string');
    const descriptionTrimmed = description.trim();
    if (!stringValidator.maxLength(descriptionTrimmed, 2000)) throw new ValidationError(`Post description ${descriptionTrimmed} must not be longer than 2000 characters`);
    return descriptionTrimmed;
  },
};

export default postValidator;
