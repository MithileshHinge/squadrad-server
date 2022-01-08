import { moveFile } from '../common/helpers';
import id from '../common/id';
import config from '../config';
import { IPostAttachment } from './IPostAttachment';
import { IAttachmentValidator } from './validator/IAttachmentValidator';

export default class MakeAttachment {
  private attachmentValidator: IAttachmentValidator;

  constructor(attachmentValidator: IAttachmentValidator) {
    this.attachmentValidator = attachmentValidator;
  }

  /**
   * Takes attachment type and temporary src and makes an IPostAttachment object - only image and video are considered attachments
   * Handles file validation, renaming and moving.
   * @param type One of PostAttachmentTypes
   * @param src file source relative to config.tmpDir
   * @throws ValidationError if file does not exist or bad params are provided
   */
  async make({ type, src }: { type: string, src: string }): Promise<IPostAttachment> {
    const typeValidated = this.attachmentValidator.validateType(type);
    const srcValidated = this.attachmentValidator.validateSrc(typeValidated, src);

    const attachmentId = id.createId();
    await moveFile(`${config.tmpDir}/${srcValidated}`, `${config.postAttachmentsDir}/${attachmentId}`);
    return {
      type: typeValidated,
      attachmentId,
    };
  }
}
