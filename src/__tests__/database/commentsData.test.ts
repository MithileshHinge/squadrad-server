/* eslint-disable no-underscore-dangle */
import { Collection, Document, ObjectId } from 'mongodb';
import DatabaseError from '../../common/errors/DatabaseError';
import id from '../../common/id';
import CommentsData from '../../database/CommentsData';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import newComment, { convertSampleCommentsToDBComments, sampleCommentsOnPost } from '../__mocks__/comment/comments';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';

describe('Comments data access gateway', () => {
  const commentsData = new CommentsData(mockDb, handleDatabaseError);
  let commentsCollection: Collection<Document>;
  let sampleInsertedComments: any;
  let samplePostId: string;
  let sampleInsertedCommentsOnPost1: any;
  let sampleInsertedComment: {
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  };

  beforeEach(async () => {
    commentsCollection = await (await mockDb()).createCollection('comments');

    // insert fake data
    samplePostId = id.createId();
    sampleInsertedCommentsOnPost1 = sampleCommentsOnPost();
    sampleInsertedCommentsOnPost1 = convertSampleCommentsToDBComments(sampleInsertedCommentsOnPost1, samplePostId);

    const postId2 = id.createId();
    let comments2: any = sampleCommentsOnPost();
    comments2 = convertSampleCommentsToDBComments(comments2, postId2);

    sampleInsertedComments = [...sampleInsertedCommentsOnPost1, ...comments2].map((comment) => ({
      _id: new ObjectId(comment.commentId),
      userId: comment.userId,
      postId: comment.postId,
      text: comment.text,
      replyToCommentId: comment.replyToCommentId,
    }));

    [sampleInsertedComment] = sampleInsertedCommentsOnPost1;

    commentsCollection.insertMany(sampleInsertedComments);
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('comments');
  });

  afterAll(async () => {
    closeConnection();
  });

  describe('insertNewComment', () => {
    it('Can insert new comment', async () => {
      const comment = newComment();
      await expect(commentsData.insertNewComment(comment)).resolves.not.toThrowError();
      expect(commentsCollection.findOne({ _id: new ObjectId(comment.commentId) })).resolves.toStrictEqual(expect.objectContaining({
        userId: comment.userId,
        postId: comment.postId,
        text: comment.text,
      }));
    });

    it('Should throw error if commentId already exists', async () => {
      const comment1 = newComment();
      commentsCollection.insertOne({
        _id: new ObjectId(comment1.commentId),
        ...comment1,
      });
      const comment2 = { ...newComment(), commentId: comment1.commentId };

      await expect(commentsData.insertNewComment(comment2)).rejects.toThrow(DatabaseError);
      expect(commentsCollection.findOne({ _id: new ObjectId(comment1.commentId) })).resolves.toStrictEqual(expect.objectContaining({
        userId: comment1.userId,
        postId: comment1.postId,
        text: comment1.text,
      }));
    });

    it('Can insert a new reply', async () => {
      const comment = newComment(true);
      await expect(commentsData.insertNewComment(comment)).resolves.not.toThrowError();
      expect(commentsCollection.findOne({ _id: new ObjectId(comment.commentId) })).resolves.toStrictEqual(expect.objectContaining({
        userId: comment.userId,
        postId: comment.postId,
        text: comment.text,
        replyToCommentId: comment.replyToCommentId,
      }));
    });
  });

  describe('fetchCommentById', () => {
    it('Correctly fetches comment by Id', async () => {
      await expect(commentsData.fetchCommentById(sampleInsertedComment.commentId)).resolves.toStrictEqual({ ...sampleInsertedComment, replyToCommentId: null });
    });

    it('Returns null if comment of commentId is not found', async () => {
      const commentId = id.createId();
      await expect(commentsData.fetchCommentById(commentId)).resolves.toBeNull();
    });
  });

  describe('fetchCommentsByPostId', () => {
    it('Correctly returns all comments with postId', async () => {
      await expect(commentsData.fetchCommentsByPostId(samplePostId)).resolves.toStrictEqual(sampleInsertedCommentsOnPost1.map((comment: any) => ({ ...comment, replyToCommentId: comment.replyToCommentId ? comment.replyToCommentId : null })));
    });
    it('Returns empty array if there are no comments with postId', async () => {
      const postId = id.createId();
      await expect(commentsData.fetchCommentsByPostId(postId)).resolves.toEqual([]);
    });
  });
});
