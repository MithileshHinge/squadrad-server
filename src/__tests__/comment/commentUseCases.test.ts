import AddComment from '../../comment/AddComment';
import commentValidator from '../../comment/validator';
import id from '../../common/id';
import FindManualSub from '../../manual-sub/FindManualSub';
import manualSubValidator from '../../manual-sub/validator';
import FindAttachment from '../../post-attachment/FindAttachment';
import attachmentValidator from '../../post-attachment/validator';
import FindPost from '../../post/FindPost';
import postValidator from '../../post/validator';
import FindSquad from '../../squad/FindSquad';
import squadValidator from '../../squad/validator';
import mockCommentsData from '../__mocks__/comment/mockCommentsData';
import faker from '../__mocks__/faker';
import mockManualSubsData from '../__mocks__/manual-sub/mockManualSubsData';
import mockPostsData from '../__mocks__/post/mockPostsData';
import mockSquadsData from '../__mocks__/squad/mockSquadsData';
import newPost from '../__mocks__/post/posts';
import newSquad from '../__mocks__/squad/squads';
import newManualSub from '../__mocks__/manual-sub/manualSubs';
import ManualSubStatuses from '../../manual-sub/ManualSubStatuses';
import ValidationError from '../../common/errors/ValidationError';
import newComment, { convertSampleCommentsToDBComments, sampleCommentsOnPost } from '../__mocks__/comment/comments';
import FindComment from '../../comment/FindComment';

describe('Comment use cases', () => {
  beforeEach(() => {
    Object.values({
      ...mockSquadsData,
      ...mockManualSubsData,
      ...mockPostsData,
      ...mockCommentsData,
    }).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('AddComment use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const findManualSub = new FindManualSub(mockManualSubsData, manualSubValidator);
    const findAttachment = new FindAttachment(attachmentValidator);
    const findPost = new FindPost(findSquad, findManualSub, findAttachment, mockPostsData, postValidator);
    const addComment = new AddComment(findPost, mockCommentsData, commentValidator);

    it('User can add a comment on a post they have access to', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      const squad = { ...newSquad(), userId: creatorUserId };
      const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
      const manualSub = {
        ...newManualSub(),
        userId,
        creatorUserId,
        squadId: squad.squadId,
        amount: squad.amount,
        subscriptionStatus: ManualSubStatuses.ACTIVE,
      };

      mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      mockPostsData.fetchPostById.mockResolvedValueOnce(post);
      mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);

      const text = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 }));
      await expect(addComment.add({ userId, postId: post.postId, text })).resolves.not.toBeNull();
      expect(mockCommentsData.insertNewComment).toHaveBeenCalledWith(expect.objectContaining({ commentId: expect.any(String), userId, postId: post.postId }));
    });

    it('User cannot add comment on a post they dont have access to', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      const higherSquad = { ...newSquad(), userId: creatorUserId, amount: 1000 };
      const lowerSquad = { ...newSquad(), userId: creatorUserId, amount: 500 };
      const post = { ...newPost(), userId: creatorUserId, squadId: higherSquad.squadId };
      const manualSub = {
        ...newManualSub(),
        userId,
        creatorUserId,
        squadId: lowerSquad.squadId,
        amount: lowerSquad.amount,
        subscriptionStatus: ManualSubStatuses.ACTIVE,
      };

      mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(higherSquad);
      mockPostsData.fetchPostById.mockResolvedValueOnce(post);
      mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);

      const text = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 }));
      await expect(addComment.add({ userId, postId: post.postId, text })).resolves.toBeNull();
      expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
    });

    it('User cannot add comment on a post that doesnt exist, return null', async () => {
      const userId = id.createId();
      const postId = id.createId();
      mockPostsData.fetchPostById.mockResolvedValueOnce(null);

      const text = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 }));
      await expect(addComment.add({ userId, postId, text })).resolves.toBeNull();
      expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
    });

    it('User can reply to a comment on a post they have access to', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      const squad = { ...newSquad(), userId: creatorUserId };
      const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
      const manualSub = {
        ...newManualSub(),
        userId,
        creatorUserId,
        squadId: squad.squadId,
        amount: squad.amount,
        subscriptionStatus: ManualSubStatuses.ACTIVE,
      };
      const comment = { ...newComment(), userId, postId: post.postId };

      mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      mockPostsData.fetchPostById.mockResolvedValueOnce(post);
      mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
      mockCommentsData.fetchCommentById.mockResolvedValueOnce(comment);

      const text = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 }));
      await expect(addComment.add({
        userId, postId: post.postId, text, replyToCommentId: comment.commentId,
      })).resolves.not.toBeNull();
      expect(mockCommentsData.insertNewComment).toHaveBeenCalledWith(expect.objectContaining({
        commentId: expect.any(String), userId, postId: post.postId, replyToCommentId: comment.commentId,
      }));
    });

    it('User cannot reply to a comment on a post they dont have access to', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      const higherSquad = { ...newSquad(), userId: creatorUserId, amount: 1000 };
      const lowerSquad = { ...newSquad(), userId: creatorUserId, amount: 500 };
      const post = { ...newPost(), userId: creatorUserId, squadId: higherSquad.squadId };
      const manualSub = {
        ...newManualSub(),
        userId,
        creatorUserId,
        squadId: lowerSquad.squadId,
        amount: lowerSquad.amount,
        subscriptionStatus: ManualSubStatuses.ACTIVE,
      };
      const comment = { ...newComment(), userId, postId: post.postId };

      mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(higherSquad);
      mockPostsData.fetchPostById.mockResolvedValueOnce(post);
      mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
      mockCommentsData.fetchCommentById.mockResolvedValueOnce(comment);

      const text = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 }));
      await expect(addComment.add({
        userId, postId: post.postId, text, replyToCommentId: comment.commentId,
      })).resolves.toBeNull();
      expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
    });

    it('User cannot reply to a comment that doesnt exist', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      const post = { ...newPost(), userId: creatorUserId };
      const commentId = id.createId();
      mockPostsData.fetchPostById.mockResolvedValueOnce(post);
      mockCommentsData.fetchCommentById.mockResolvedValueOnce(null);
      const text = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 }));
      await expect(addComment.add({
        userId, postId: post.postId, text, replyToCommentId: commentId,
      })).resolves.toBeNull();
      expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
    });

    it('User cannot reply to a reply', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      const post = { ...newPost(), userId: creatorUserId };
      const comment = { ...newComment(), userId, postId: post.postId };
      const reply = {
        ...newComment(true), userId, postId: post.postId, replyToCommentId: comment.commentId,
      };

      mockPostsData.fetchPostById.mockResolvedValueOnce(post);
      mockCommentsData.fetchCommentById.mockResolvedValueOnce(reply);
      const text = faker.lorem.sentences(faker.datatype.number({ min: 1, max: 3 }));
      await expect(addComment.add({
        userId, postId: post.postId, text, replyToCommentId: reply.commentId,
      })).resolves.toBeNull();
      expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
    });

    describe('Text validation', () => {
      it('Should throw error if text is not a string', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const post = { ...newPost(), userId: creatorUserId };

        const text: any = 1234567;
        await expect(addComment.add({ userId, postId: post.postId, text })).rejects.toThrow(ValidationError);
        expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
      });

      it('Should throw error if text is empty', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const post = { ...newPost(), userId: creatorUserId };

        await expect(addComment.add({ userId, postId: post.postId, text: '' })).rejects.toThrow(ValidationError);
        expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
      });
    });
  });

  describe('FindComment use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const findManualSub = new FindManualSub(mockManualSubsData, manualSubValidator);
    const findAttachment = new FindAttachment(attachmentValidator);
    const findPost = new FindPost(findSquad, findManualSub, findAttachment, mockPostsData, postValidator);
    const findComment = new FindComment(findPost, mockCommentsData);

    describe('FindCommentsByPostId', () => {
      it('User can get comments and replies of a post they have acces to', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squad = { ...newSquad(), userId: creatorUserId };
        const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId,
          squadId: squad.squadId,
          amount: squad.amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };

        const comments = sampleCommentsOnPost();
        const commentsInDb = convertSampleCommentsToDBComments(comments, post.postId);

        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
        mockCommentsData.fetchCommentsByPostId.mockResolvedValueOnce(commentsInDb);

        await expect(findComment.findCommentsByPostId({ userId, postId: post.postId })).resolves.toEqual(comments);
        expect(mockCommentsData.fetchCommentsByPostId).toHaveBeenCalledWith(post.postId);
      });

      it('User cannot get comments of a post they dont have access to', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const higherSquad = { ...newSquad(), userId: creatorUserId, amount: 1000 };
        const lowerSquad = { ...newSquad(), userId: creatorUserId, amount: 500 };
        const post = { ...newPost(), userId: creatorUserId, squadId: higherSquad.squadId };
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId,
          squadId: lowerSquad.squadId,
          amount: lowerSquad.amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };

        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(higherSquad);
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);

        await expect(findComment.findCommentsByPostId({ userId, postId: post.postId })).resolves.toEqual([]);
        expect(mockCommentsData.fetchCommentsByPostId).not.toHaveBeenCalled();
      });

      it('Return empty array if there are no comments', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const post = { ...newPost(), userId: creatorUserId };

        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockCommentsData.fetchCommentsByPostId.mockResolvedValueOnce([]);

        await expect(findComment.findCommentsByPostId({ userId, postId: post.postId })).resolves.toEqual([]);
        expect(mockCommentsData.fetchCommentsByPostId).toHaveBeenCalledWith(post.postId);
      });

      it('Return empty array if post does not exist', async () => {
        const userId = id.createId();
        const postId = id.createId();

        mockPostsData.fetchPostById.mockResolvedValueOnce(null);

        await expect(findComment.findCommentsByPostId({ userId, postId })).resolves.toEqual([]);
        expect(mockCommentsData.fetchCommentsByPostId).not.toHaveBeenCalled();
      });
    });
  });
});
