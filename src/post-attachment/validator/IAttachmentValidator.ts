import { PostAttachmentType } from '../IPostAttachment';

export interface IAttachmentValidator {
  validateType: (type: any) => PostAttachmentType;
  validateSrc: (type: PostAttachmentType, src: any) => string;
}
