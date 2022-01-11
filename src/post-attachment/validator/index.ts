import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import fileValidator from '../../common/validators/fileValidator';
import config from '../../config';
import { PostAttachmentType } from '../IPostAttachment';
import { IAttachmentValidator } from './IAttachmentValidator';

function isPostAttachmentType(t: any): t is PostAttachmentType {
  return Object.values(PostAttachmentType).includes(t as PostAttachmentType);
}

const attachmentValidator: IAttachmentValidator = {
  validateAttachmentId(attachmentId: any) {
    if (typeof attachmentId !== 'string') throw new ValidationError('Post attachment Id must be a string');
    const attachmentIdTrimmed = attachmentId.trim();
    if (!id.isValidId(attachmentIdTrimmed)) throw new ValidationError(`Post attachment id ${attachmentIdTrimmed} is not a valid id`);
    return attachmentIdTrimmed;
  },
  validateType(type: any): PostAttachmentType {
    if (typeof type !== 'string') throw new ValidationError('Post attachment type must be a string');
    if (!isPostAttachmentType(type)) throw new ValidationError('Invalid post attachment type');
    return type;
  },
  validateSrc(type: PostAttachmentType, src: any): string {
    if (typeof src !== 'string') throw new ValidationError('Post attachment src must be a string');
    const srcTrimmed = src.trim();
    if ((type === PostAttachmentType.IMAGE || type === PostAttachmentType.VIDEO) && !fileValidator.fileExists(`${config.tmpDir}/${srcTrimmed}`)) throw new ValidationError('Post attachment file does not exist');
    return srcTrimmed;
  },
};

export default attachmentValidator;
