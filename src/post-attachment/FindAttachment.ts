import config from '../config';
import { IAttachmentValidator } from './validator/IAttachmentValidator';

export default class FindAttachment {
  private attachmentValidator: IAttachmentValidator;

  constructor(attachmentValidator: IAttachmentValidator) {
    this.attachmentValidator = attachmentValidator;
  }

  async getSrcFromId(attachmentId: string) {
    const attachmentIdValidated = this.attachmentValidator.validateAttachmentId(attachmentId);
    return `${config.postAttachmentsDir}/${attachmentIdValidated}`;
  }
}
