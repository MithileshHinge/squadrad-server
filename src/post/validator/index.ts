import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import fileValidator from '../../common/validators/fileValidator';
import stringValidator from '../../common/validators/stringValidator';
import { IPostAttachment, PostAttachmentType } from '../IPostAttachment';
import { IPostValidator } from './IPostValidator';

function isPostAttachment(a: any): a is IPostAttachment {
  return Object.keys(a).every((val) => ['type', 'src'].includes(val)) && Object.keys(a).length === 2
    && Object.values(PostAttachmentType).includes(a.type as PostAttachmentType)
    && typeof a.src === 'string';
}

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
  validateAttachment(attachment: any): IPostAttachment {
    if (!(isPostAttachment(attachment))) throw new ValidationError('Post attachment is invalid');
    if ((attachment.type === PostAttachmentType.IMAGE || attachment.type === PostAttachmentType.VIDEO) && !fileValidator.fileExists(attachment.src)) throw new ValidationError('Post attachment file does not exist');
    if ((attachment.type === PostAttachmentType.LINK) && !stringValidator.isUrl(attachment.src)) throw new ValidationError('Post attachment link is not a valid url');
    return attachment;
  },
};

export default postValidator;
