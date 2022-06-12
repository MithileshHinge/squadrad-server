import { deleteFile } from '../common/helpers';
import FindAttachment from './FindAttachment';

export default class DeleteAttachmentFile {
  private findAttachment: FindAttachment;

  constructor(findAttachment: FindAttachment) {
    this.findAttachment = findAttachment;
  }

  /**
   * Deletes attachment file from storage, does not check access
   * @param attachmentId id of attachment whose file should be deleted
   */
  async delete(attachmentId: string) {
    const attachmentFileSrc = await this.findAttachment.getSrcFromId(attachmentId);
    await deleteFile(attachmentFileSrc);
  }
}
