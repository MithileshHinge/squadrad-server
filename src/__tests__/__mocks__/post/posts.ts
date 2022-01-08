import id from '../../../common/id';
import { IPostAttachment } from '../../../post-attachment/IPostAttachment';
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
