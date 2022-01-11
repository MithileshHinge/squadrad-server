import { PostAttachmentType } from '../IPostAttachment';

export interface IAttachmentValidator {
  validateAttachmentId: (attachmentId: any) => string;
  validateType: (type: any) => PostAttachmentType;
  validateSrc: (type: PostAttachmentType, src: any) => string;
}
