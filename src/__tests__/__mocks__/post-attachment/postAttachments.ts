import id from '../../../common/id';
import { makeAttachment } from '../../../post-attachment';
import { IPostAttachment, PostAttachmentType } from '../../../post-attachment/IPostAttachment';
import faker from '../faker';
import sampleUploadedImage from './postAttachmentParams';

export default async function newPostAttachment(attachmentType?: PostAttachmentType, createFile = false): Promise<IPostAttachment> {
  if (createFile) {
    const type = PostAttachmentType.IMAGE;
    const src = await sampleUploadedImage();
    const attachment = await makeAttachment.make({ type, src });
    return attachment;
  }
  const type = attachmentType || [PostAttachmentType.IMAGE, PostAttachmentType.VIDEO][faker.datatype.number(1)];
  const attachmentId = id.createId();
  return { type, attachmentId };
}
