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

    describe('Text validation', () => {
      it('Should throw error if text is not a string', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const post = { ...newPost(), userId: creatorUserId };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);

        const text: any = 1234567;
        await expect(addComment.add({ userId, postId: post.postId, text })).rejects.toThrow(ValidationError);
        expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
      });

      it('Should throw error if text is empty', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const post = { ...newPost(), userId: creatorUserId };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);

        await expect(addComment.add({ userId, postId: post.postId, text: '' })).rejects.toThrow(ValidationError);
        expect(mockCommentsData.insertNewComment).not.toHaveBeenCalled();
      });
    });
  });
});
