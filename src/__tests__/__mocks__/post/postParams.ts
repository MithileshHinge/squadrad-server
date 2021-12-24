import { randomBytes } from 'crypto';
import { copyFile } from '../../../common/helpers';
import id from '../../../common/id';
import { PostAttachmentType } from '../../../post/IPostAttachment';
import faker from '../faker';

export async function newPostAttachmentParam(attachmentType?: PostAttachmentType): Promise<{ type: PostAttachmentType, src: string }> {
  const type = attachmentType || [PostAttachmentType.IMAGE, PostAttachmentType.LINK][faker.datatype.number(1)];
  if (type === PostAttachmentType.LINK) {
    return {
      type,
      src: faker.internet.url(),
    };
  }
  if (type === PostAttachmentType.IMAGE) {
    const src = `tmp/test/${randomBytes(4).toString('hex')}`;
    await copyFile('src/__tests__/__mocks__/post/brownpaperbag-comic.png', src);
    return { type, src };
  }
  throw new Error('Invalid Post attachment type');
}

export default {
  // title: faker.lorem.words(3),
  description: [faker.lorem.paragraph(5).substr(0, 2000), undefined][faker.datatype.number(1)],
  squadId: [id.createId(), '', undefined][faker.datatype.number(2)],
  attachments: [],
};
