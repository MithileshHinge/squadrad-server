import { randomBytes } from 'crypto';
import { copyFile, emptyDir } from '../../../common/helpers';
import id from '../../../common/id';
import { IPostAttachment, PostAttachmentType } from '../../../post/IPostAttachment';
import faker from '../faker';

export default function newPost(postId?: string, attachment?: IPostAttachment) {
  return {
    postId: postId || id.createId(),
    userId: id.createId(),
    // title: faker.lorem.words(3),
    description: [faker.lorem.paragraph(5).substr(0, 2000), ''][faker.datatype.number(1)],
    squadId: [id.createId(), ''][faker.datatype.number(1)],
    attachment,
  };
}

export async function newPostAttachment({ postId, attachmentType, createImageFile = false }: {
  postId: string,
  attachmentType?: PostAttachmentType,
  createImageFile?: boolean
}): Promise<IPostAttachment> {
  if (createImageFile) {
    const type = PostAttachmentType.IMAGE;
    await emptyDir(`posts/${postId}`);
    const src = `${postId}/${randomBytes(4).toString('hex')}`;
    await copyFile('src/__tests__/__mocks__/post/brownpaperbag-comic.jpg', `posts/${src}`);
    return { type, src };
  }
  const type = attachmentType || [PostAttachmentType.IMAGE, PostAttachmentType.LINK][faker.datatype.number(1)];
  const src = type === PostAttachmentType.LINK ? faker.internet.url() : `posts/${id.createId()}/${randomBytes(4).toString('hex')}`;
  return { type, src };
}
