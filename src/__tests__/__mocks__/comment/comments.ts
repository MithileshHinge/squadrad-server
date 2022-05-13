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

export function sampleCommentsOnPost() {
  const comments: Array<{
    commentId: string,
    userId: string,
    text: string,
    replies: Array<{
      commentId: string, userId: string, text: string,
    }>
  }> = [
    {
      commentId: id.createId(),
      userId: id.createId(),
      text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
      replies: [
        {
          commentId: id.createId(), userId: id.createId(), text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
        },
        {
          commentId: id.createId(), userId: id.createId(), text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
        },
      ],
    },
    {
      commentId: id.createId(),
      userId: id.createId(),
      text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
      replies: [
        {
          commentId: id.createId(), userId: id.createId(), text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
        },
      ],
    },
    {
      commentId: id.createId(),
      userId: id.createId(),
      text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
      replies: [],
    },
    {
      commentId: id.createId(),
      userId: id.createId(),
      text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
      replies: [
        {
          commentId: id.createId(), userId: id.createId(), text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
        },
      ],
    },
    {
      commentId: id.createId(),
      userId: id.createId(),
      text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
      replies: [
        {
          commentId: id.createId(), userId: id.createId(), text: faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 })),
        },
      ],
    },
  ];

  return comments;
}

export function convertSampleCommentsToDBComments(sampleComments: Array<{
  commentId: string,
  userId: string,
  text: string,
  replies: Array<{
    commentId: string, userId: string, text: string,
  }>
}>, postId: string) {
  const commentsToReturn: Array<{
    commentId: string,
    postId: string,
    userId: string,
    text: string
    replyToCommentId?: string,
  }> = [];

  sampleComments.forEach((comment) => {
    commentsToReturn.push({
      commentId: comment.commentId,
      postId,
      userId: comment.userId,
      text: comment.text,
      replyToCommentId: undefined,
    });
    comment.replies.forEach((reply) => {
      commentsToReturn.push({
        commentId: reply.commentId,
        postId,
        userId: reply.userId,
        text: reply.text,
        replyToCommentId: comment.commentId,
      });
    });
  });

  return commentsToReturn;
}
