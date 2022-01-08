import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import stringValidator from '../../common/validators/stringValidator';
import { IPostValidator } from './IPostValidator';

const postValidator: IPostValidator = {
  validatePostId(postId: any): string {
    if (typeof postId !== 'string') throw new ValidationError('Post id must be a string');
    const postIdTrimmed = postId.trim();
    if (!id.isValidId(postIdTrimmed)) throw new ValidationError(`Post id ${postIdTrimmed} is not a valid id`);
    return postIdTrimmed;
  },
  // validateTitle(title: string): string {
  //   if (typeof title !== 'string') throw new ValidationError('Post title must be a string');
  //   const titleTrimmed = title.trim();
  //   if (!stringValidator.minLength(titleTrimmed, 3)) throw new ValidationError(`Post title ${titleTrimmed} must have at least 3 letters`);
  //   if (!stringValidator.maxLength(titleTrimmed, 50)) throw new ValidationError(`Post title ${titleTrimmed} must not be longer than 50 characters`);
  //   return titleTrimmed;
  // },
  validateDescription(description: string): string {
    if (typeof description !== 'string') throw new ValidationError('Post description must be a string');
    const descriptionTrimmed = description.trim();
    if (!stringValidator.maxLength(descriptionTrimmed, 2000)) throw new ValidationError(`Post description ${descriptionTrimmed} must not be longer than 2000 characters`);
    return descriptionTrimmed;
  },
  validateLink(link: any): string {
    if (typeof link !== 'string') throw new ValidationError('Post attached link must be a string');
    const linkTrimmed = link.trim();
    if (!stringValidator.isUrl(linkTrimmed)) throw new ValidationError('Post attached link is not a valid url');
    return linkTrimmed;
  },
};

export default postValidator;
