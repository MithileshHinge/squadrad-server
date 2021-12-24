import ValidationError from '../../common/errors/ValidationError';
import { emptyDir } from '../../common/helpers';
import id from '../../common/id';
import fileValidator from '../../common/validators/fileValidator';
import FindManualSub from '../../manual-sub/FindManualSub';
import ManualSubStatuses from '../../manual-sub/ManualSubStatuses';
import manualSubValidator from '../../manual-sub/validator';
import AddPost from '../../post/AddPost';
import FindPost from '../../post/FindPost';
import { PostAttachmentType } from '../../post/IPostAttachment';
import postValidator from '../../post/validator';
import FindSquad from '../../squad/FindSquad';
import squadValidator from '../../squad/validator';
import newCreator from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';
import newManualSub from '../__mocks__/manual-sub/manualSubs';
import mockManualSubsData from '../__mocks__/manual-sub/mockManualSubsData';
import mockPostsData from '../__mocks__/post/mockPostsData';
import samplePostParams, { newPostAttachmentParam } from '../__mocks__/post/postParams';
import newPost from '../__mocks__/post/posts';
import mockSquadsData from '../__mocks__/squad/mockSquadsData';
import newSquad from '../__mocks__/squad/squads';

describe('Post use cases', () => {
  beforeEach(() => {
    Object.values({ ...mockPostsData, ...mockSquadsData }).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  afterEach(async () => {
    await emptyDir('posts/test');
    await emptyDir('tmp');
  });

  describe('AddPost use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const addPost = new AddPost(findSquad, mockPostsData, postValidator);
    const existingCreator = newCreator();

    it('Can create a new post', async () => {
      if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
        const squad = { ...newSquad(), userId: existingCreator.userId };
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      }
      await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams })).resolves.not.toThrowError();
      expect(mockPostsData.insertNewPost).toHaveBeenCalled();
    });

    it('Can create a new post with link', async () => {
      if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
        const squad = { ...newSquad(), userId: existingCreator.userId };
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      }
      await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, attachments: [(await newPostAttachmentParam(PostAttachmentType.LINK))] })).resolves.not.toThrowError();
      expect(mockPostsData.insertNewPost).toHaveBeenCalledWith(expect.objectContaining({ attachments: [{ type: PostAttachmentType.LINK, src: expect.any(String) }] }));
    });

    it('Can create a new post with image', async () => {
      if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
        const squad = { ...newSquad(), userId: existingCreator.userId };
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      }
      const post = await addPost.add({ userId: existingCreator.userId, ...samplePostParams, attachments: [(await newPostAttachmentParam(PostAttachmentType.IMAGE))] });
      expect(post.attachments).toBeTruthy();
      expect(mockPostsData.insertNewPost).toHaveBeenCalledWith(expect.objectContaining({ attachments: [{ type: PostAttachmentType.IMAGE, src: expect.any(String) }] }));
      expect(fileValidator.fileExists(`posts/test/${post.attachments[0].src}`)).toBeTruthy();
    });

    describe('userId validation', () => {
      it('Should throw error if userId is not a string', async () => {
        const userId: any = 523523523;
        await expect(addPost.add({ userId, ...samplePostParams })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.fetchSquadBySquadId).not.toHaveBeenCalled();
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });
    });

    // describe('title validation', () => {
    //   it('Should throw error if title is not a string', async () => {
    //     const title: any = 749238232;
    //     await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
    //     expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
    //   });

    //   describe('Post title must be >= 3 letters', () => {
    //     ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((title) => {
    //       it(`should throw error for "${title}"`, async () => {
    //         await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
    //         expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
    //       });
    //     });
    //   });

    //   describe('Post title must be <= 50 characters', () => {
    //     ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((title) => {
    //       it(`should throw error for ${title}`, async () => {
    //         await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, title })).rejects.toThrow(ValidationError);
    //         expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
    //       });
    //     });
    //   });
    // });

    describe('Post description validation', () => {
      it('Should throw error if description is not a string', async () => {
        const description: any = 43432;
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, description })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.fetchSquadBySquadId).not.toHaveBeenCalled();
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });

      it('Should throw error if description is >2000 characters', async () => {
        const description = faker.datatype.string(2001);
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, description })).rejects.toThrow(ValidationError);
        expect(mockSquadsData.fetchSquadBySquadId).not.toHaveBeenCalled();
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });
    });

    describe('SquadId validation', () => {
      describe('Should throw error if squadId is not string or undefined', () => {
        [1234, null, true].forEach((squadId: any) => {
          it(`Should throw error for ${squadId}`, async () => {
            await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, squadId })).rejects.toThrow(ValidationError);
            expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
          });
        });
      });

      it('Should not throw error for undefined and empty string', async () => {
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, squadId: '' })).resolves.not.toThrowError();
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, squadId: undefined })).resolves.not.toThrowError();
        expect(mockPostsData.insertNewPost).toHaveBeenCalledTimes(2);
      });

      it('Should throw error if squad of squadId does not exist', async () => {
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(null);
        await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, squadId: id.createId() })).rejects.toThrow(ValidationError);
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
      });
    });
  });

  describe('FindPost use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const findManualSub = new FindManualSub(mockManualSubsData, manualSubValidator);
    const findPost = new FindPost(findSquad, findManualSub, mockPostsData);

    describe('findPostsByUserId', () => {
      it('Should return all posts if userId and creatorUserId are the same', async () => {
        const userId = id.createId();
        const creatorUserId = userId;
        const posts = [newPost(), newPost(), newPost()];
        mockPostsData.fetchAllPostsByUserId.mockResolvedValueOnce(posts);
        await expect(findPost.findPostsByUserId({ userId, creatorUserId })).resolves.toStrictEqual([
          expect.objectContaining({ postId: posts[0].postId }),
          expect.objectContaining({ postId: posts[1].postId }),
          expect.objectContaining({ postId: posts[2].postId }),
        ]);
        expect(mockSquadsData.fetchAllSquadsByUserId).not.toHaveBeenCalled();
        expect(mockManualSubsData.fetchManualSubByUserIds).not.toHaveBeenCalled();
      });

      it('Should return all posts by creatorUserId if user is subscribed to the highest squad', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squads = [{ ...newSquad(), amount: 100 }, { ...newSquad(), amount: 500 }];
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId,
          squadId: squads[1].squadId,
          amount: squads[1].amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        const posts = [
          { ...newPost(), squadId: '' },
          { ...newPost(), squadId: squads[0].squadId },
          { ...newPost(), squadId: squads[1].squadId },
        ];
        mockPostsData.fetchAllPostsByUserId.mockResolvedValueOnce(posts);
        mockSquadsData.fetchAllSquadsByUserId.mockResolvedValueOnce(squads);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);

        await expect(findPost.findPostsByUserId({ userId, creatorUserId })).resolves.toEqual(expect.arrayContaining([
          expect.objectContaining({ postId: posts[0].postId }),
          expect.objectContaining({ postId: posts[1].postId }),
          expect.objectContaining({ postId: posts[2].postId }),
        ]));
      });
    });
  });
});
