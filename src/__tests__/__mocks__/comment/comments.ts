import id from '../../../common/id';
import faker from '../faker';

export default function newComment(isReply?: boolean) {
  return {
    commentId: id.createId(),
    userId: id.createId(),
    postId: id.createId(),
    text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
    replyToCommentId: isReply ? id.createId() : undefined,
  };
}
