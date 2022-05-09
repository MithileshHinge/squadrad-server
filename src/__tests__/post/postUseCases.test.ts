import fs from 'fs-extra';
import ValidationError from '../../common/errors/ValidationError';
import { emptyDir } from '../../common/helpers';
import id from '../../common/id';
import fileValidator from '../../common/validators/fileValidator';
import config from '../../config';
import FindManualSub from '../../manual-sub/FindManualSub';
import ManualSubStatuses from '../../manual-sub/ManualSubStatuses';
import manualSubValidator from '../../manual-sub/validator';
import AddPost from '../../post/AddPost';
import FindPost from '../../post/FindPost';
import { PostAttachmentType } from '../../post-attachment/IPostAttachment';
import postValidator from '../../post/validator';
import FindSquad from '../../squad/FindSquad';
import squadValidator from '../../squad/validator';
import newCreator from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';
import newManualSub from '../__mocks__/manual-sub/manualSubs';
import mockManualSubsData from '../__mocks__/manual-sub/mockManualSubsData';
import mockPostsData from '../__mocks__/post/mockPostsData';
import samplePostParams from '../__mocks__/post/postParams';
import newPost from '../__mocks__/post/posts';
import mockSquadsData from '../__mocks__/squad/mockSquadsData';
import newSquad from '../__mocks__/squad/squads';
import MakeAttachment from '../../post-attachment/MakeAttachment';
import attachmentValidator from '../../post-attachment/validator';
import { sampleUploadedImage, sampleUploadedVideo } from '../__mocks__/post-attachment/postAttachmentParams';
import FindAttachment from '../../post-attachment/FindAttachment';
import newPostAttachment from '../__mocks__/post-attachment/postAttachments';

describe('Post use cases', () => {
  beforeEach(() => {
    Object.values({ ...mockPostsData, ...mockSquadsData }).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  afterEach(async () => {
    await emptyDir(config.postAttachmentsDir);
    await emptyDir(config.tmpDir);
  });

  describe('AddPost use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const makeAttachment = new MakeAttachment(attachmentValidator);
    const addPost = new AddPost(findSquad, makeAttachment, mockPostsData, postValidator);
    const existingCreator = newCreator();

    it('Can create a new post', async () => {
      if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
        const squad = { ...newSquad(), userId: existingCreator.userId };
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      }
      await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams })).resolves.not.toThrowError();
      expect(mockPostsData.insertNewPost).toHaveBeenCalled();
    });

    it('Can create a new post with image', async () => {
      if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
        const squad = { ...newSquad(), userId: existingCreator.userId };
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      }
      const sampleImgSrc = await sampleUploadedImage();
      const post = await addPost.add({
        userId: existingCreator.userId, ...samplePostParams, type: PostAttachmentType.IMAGE, src: sampleImgSrc,
      });
      expect(post.attachment).toBeTruthy();
      expect(post.link).toStrictEqual(undefined);
      expect(mockPostsData.insertNewPost).toHaveBeenCalledWith(expect.objectContaining({ attachment: { type: PostAttachmentType.IMAGE, attachmentId: expect.any(String) } }));
      expect(fileValidator.fileExists(`${config.postAttachmentsDir}/${post.attachment!.attachmentId}`)).toBeTruthy();
    });

    it('Can create a new post with video', async () => {
      if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
        const squad = { ...newSquad(), userId: existingCreator.userId };
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      }
      const sampleVideoSrc = await sampleUploadedVideo();
      const post = await addPost.add({
        userId: existingCreator.userId, ...samplePostParams, type: PostAttachmentType.VIDEO, src: sampleVideoSrc,
      });
      expect(post.attachment).toBeTruthy();
      expect(post.link).toStrictEqual(undefined);
      expect(mockPostsData.insertNewPost).toHaveBeenCalledWith(expect.objectContaining({ attachment: { type: PostAttachmentType.VIDEO, attachmentId: expect.any(String) } }));
      expect(fileValidator.fileExists(`${config.postAttachmentsDir}/${post.attachment!.attachmentId}`)).toBeTruthy();
    });

    it('Can create a new post with link', async () => {
      if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
        const squad = { ...newSquad(), userId: existingCreator.userId };
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      }
      const sampleLink = 'ncase.me/trust';
      const post = await addPost.add({
        userId: existingCreator.userId, ...samplePostParams, link: sampleLink,
      });
      expect(post.attachment).toBeFalsy();
      expect(post.link).toBeTruthy();
      expect(mockPostsData.insertNewPost).toHaveBeenCalledWith(expect.objectContaining({ link: expect.any(String) }));
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

    describe('Type validation', () => {
      it('Should not make attachment if type is not provided', async () => {
        if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
          const squad = { ...newSquad(), userId: existingCreator.userId };
          mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        }
        const sampleImgSrc = await sampleUploadedImage();
        const post = await addPost.add({
          userId: existingCreator.userId, ...samplePostParams, src: sampleImgSrc,
        });
        expect(post.attachment).toBeFalsy();
        expect(post.link).toStrictEqual(undefined);
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalledWith(expect.objectContaining({ attachment: expect.objectContaining({ attachmentId: expect.any(String) }) }));
        expect(fs.readdirSync(config.postAttachmentsDir)).toEqual([]);
      });

      describe('Should throw error if type is not a valid type', () => {
        [null, 12345, '', 'blah', 'IMAGE'].forEach((type: any) => {
          it(`Should throw error for ${type}`, async () => {
            if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
              const squad = { ...newSquad(), userId: existingCreator.userId };
              mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
            }
            const sampleImgSrc = await sampleUploadedImage();
            await expect(addPost.add({
              userId: existingCreator.userId, ...samplePostParams, type, src: sampleImgSrc,
            })).rejects.toThrow(ValidationError);
            expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
            expect(fs.readdirSync(config.postAttachmentsDir)).toEqual([]);
          });
        });
      });
    });

    describe('Src validation', () => {
      it('Should not make attachment if src is not provided', async () => {
        if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
          const squad = { ...newSquad(), userId: existingCreator.userId };
          mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        }
        const type = [PostAttachmentType.IMAGE, PostAttachmentType.VIDEO][faker.datatype.number(1)];
        const post = await addPost.add({
          userId: existingCreator.userId, ...samplePostParams, type,
        });
        expect(post.attachment).toBeFalsy();
        expect(post.link).toStrictEqual(undefined);
        expect(mockPostsData.insertNewPost).not.toHaveBeenCalledWith(expect.objectContaining({ attachment: expect.anything() }));
        expect(fs.readdirSync(config.postAttachmentsDir)).toEqual([]);
      });

      describe('Should throw error for invalid src', () => {
        [null, 1234567, '', 'src', 'blahblah', `${config.tmpDir}/non-existentfile.jpg`].forEach((src: any) => {
          it(`Should throw error for ${src}`, async () => {
            if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
              const squad = { ...newSquad(), userId: existingCreator.userId };
              mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
            }
            const type = [PostAttachmentType.IMAGE, PostAttachmentType.VIDEO][faker.datatype.number(1)];
            await expect(addPost.add({
              userId: existingCreator.userId, ...samplePostParams, type, src,
            })).rejects.toThrow(ValidationError);
            expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
            expect(fs.readdirSync(config.postAttachmentsDir)).toEqual([]);
          });
        });
      });
    });

    describe('Link validation', () => {
      describe('Should throw error for invalid url', () => {
        ['', null, 'abc', 'https://', 'www', 'www.', '.com'].forEach((url: any) => {
          it(`Should throw error for ${url}`, async () => {
            if (samplePostParams.squadId !== undefined && samplePostParams.squadId !== '') {
              const squad = { ...newSquad(), userId: existingCreator.userId };
              mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
            }
            await expect(addPost.add({ userId: existingCreator.userId, ...samplePostParams, link: url })).rejects.toThrow(ValidationError);
            expect(mockPostsData.insertNewPost).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('FindPost use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const findManualSub = new FindManualSub(mockManualSubsData, manualSubValidator);
    const findAttachment = new FindAttachment(attachmentValidator);
    const findPost = new FindPost(findSquad, findManualSub, findAttachment, mockPostsData, postValidator);

    describe('checkPostAccess', () => {
      it('Should return true if it is user\'s own post', () => {
        const userId = id.createId();
        const squad = { ...newSquad(), userId };
        const post = { ...newPost(), userId, squadId: squad.squadId };
        expect(FindPost.checkPostAccess({
          userId, post, squad, manualSub: null,
        })).toBeTruthy();
      });

      it('Should return true if post is free', () => {
        const userId = id.createId();
        const post = { ...newPost(), squadId: '' };
        expect(FindPost.checkPostAccess({
          userId, post, squad: null, manualSub: null,
        })).toBeTruthy();
      });

      it('Should return true if squad does not exist', () => {
        const userId = id.createId();
        const post = newPost();
        expect(FindPost.checkPostAccess({
          userId, post, squad: null, manualSub: null,
        })).toBeTruthy();
      });

      it('Should return true if user has subscribed to the same squad', () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squad = { ...newSquad(), userId: creatorUserId };
        const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(), userId, creatorUserId, squadId: squad.squadId, amount: squad.amount, subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        expect(FindPost.checkPostAccess({
          userId, post, squad, manualSub,
        })).toBeTruthy();
      });

      it('Should return false if user has subscribed to the same squad but subscription is not active', () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squad = { ...newSquad(), userId: creatorUserId };
        const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(), userId, creatorUserId, squadId: squad.squadId, amount: squad.amount, subscriptionStatus: ManualSubStatuses.CREATED,
        };
        expect(FindPost.checkPostAccess({
          userId, post, squad, manualSub,
        })).toBeFalsy();
      });

      it('Should return true if user has subscribed to a higher squad', () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squad = { ...newSquad(), userId: creatorUserId, amount: 100 };
        const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(), userId, creatorUserId, squadId: id.createId(), amount: 200, subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        expect(FindPost.checkPostAccess({
          userId, post, squad, manualSub,
        })).toBeTruthy();
      });

      it('Should return false if user has subscribed to a higher squad but subscription is not active', () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squad = { ...newSquad(), userId: creatorUserId, amount: 100 };
        const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(), userId, creatorUserId, squadId: id.createId(), amount: 200, subscriptionStatus: ManualSubStatuses.PAYMENT_PENDING,
        };
        expect(FindPost.checkPostAccess({
          userId, post, squad, manualSub,
        })).toBeFalsy();
      });

      it('Should return false if user has subscribed to a lower squad', () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squad = { ...newSquad(), userId: creatorUserId, amount: 200 };
        const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(), userId, creatorUserId, squadId: id.createId(), amount: 100, subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        expect(FindPost.checkPostAccess({
          userId, post, squad, manualSub,
        })).toBeFalsy();
      });

      it('Should return false if user has not subscribed', () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squad = { ...newSquad(), userId: creatorUserId };
        const post = { ...newPost(), userId: creatorUserId, squadId: squad.squadId };

        expect(FindPost.checkPostAccess({
          userId, post, squad, manualSub: null,
        })).toBeFalsy();
      });
    });

    describe('findPostsByUserId', () => {
      it('Should return all posts as accessible if userId and creatorUserId are the same', async () => {
        const userId = id.createId();
        const creatorUserId = userId;
        const posts = [newPost(), newPost(), newPost()];
        mockPostsData.fetchAllPostsByUserId.mockResolvedValueOnce(posts);
        await expect(findPost.findPostsByUserId({ userId, creatorUserId })).resolves.toStrictEqual([
          expect.objectContaining({ postId: posts[0].postId, locked: false }),
          expect.objectContaining({ postId: posts[1].postId, locked: false }),
          expect.objectContaining({ postId: posts[2].postId, locked: false }),
        ]);
      });

      it('Should return all posts by creatorUserId as accessible if user is subscribed to the highest squad', async () => {
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
          expect.objectContaining({ postId: posts[0].postId, locked: false }),
          expect.objectContaining({ postId: posts[1].postId, locked: false }),
          expect.objectContaining({ postId: posts[2].postId, locked: false }),
        ]));
      });

      it('Should return empty array if creator has no posts or creator does not exist', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        mockPostsData.fetchAllPostsByUserId.mockResolvedValueOnce([]);
        await expect(findPost.findPostsByUserId({ userId, creatorUserId })).resolves.toStrictEqual([]);
      });

      it('Should return all posts that are locked as locked and others as free', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squads = [{ ...newSquad(), amount: 100 }, { ...newSquad(), amount: 500 }];
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId,
          squadId: squads[0].squadId,
          amount: squads[0].amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        const posts = [
          { ...newPost(), squadId: '' },
          { ...newPost(), squadId: squads[0].squadId },
          { ...newPost(), squadId: squads[0].squadId },
          { ...newPost(), squadId: squads[1].squadId },
          { ...newPost(), squadId: squads[1].squadId },
        ];
        mockPostsData.fetchAllPostsByUserId.mockResolvedValueOnce(posts);
        mockSquadsData.fetchAllSquadsByUserId.mockResolvedValueOnce(squads);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);

        await expect(findPost.findPostsByUserId({ userId, creatorUserId })).resolves.toEqual(expect.arrayContaining([
          expect.objectContaining({ postId: posts[0].postId, locked: false }),
          expect.objectContaining({ postId: posts[1].postId, locked: false }),
          expect.objectContaining({ postId: posts[2].postId, locked: false }),
          expect.objectContaining({ postId: posts[3].postId, locked: true }),
          expect.objectContaining({ postId: posts[4].postId, locked: true }),
        ]));
      });

      it('Should have image or video attachment src ONLY for unlocked posts', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squads = [{ ...newSquad(), amount: 100 }, { ...newSquad(), amount: 500 }];
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId,
          squadId: squads[0].squadId,
          amount: squads[0].amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        const attachments = [
          await newPostAttachment(PostAttachmentType.IMAGE),
          await newPostAttachment(PostAttachmentType.IMAGE),
          await newPostAttachment(PostAttachmentType.VIDEO),
          await newPostAttachment(PostAttachmentType.IMAGE),
          await newPostAttachment(PostAttachmentType.VIDEO),
        ];
        const posts = [
          { ...newPost(undefined, attachments[0]), squadId: '' },
          { ...newPost(undefined, attachments[1]), squadId: squads[0].squadId },
          { ...newPost(undefined, attachments[2]), squadId: squads[0].squadId },
          { ...newPost(undefined, attachments[3]), squadId: squads[1].squadId },
          { ...newPost(undefined, attachments[4]), squadId: squads[1].squadId },
        ];
        mockPostsData.fetchAllPostsByUserId.mockResolvedValueOnce(posts);
        mockSquadsData.fetchAllSquadsByUserId.mockResolvedValueOnce(squads);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);

        await expect(findPost.findPostsByUserId({ userId, creatorUserId })).resolves.toEqual(expect.arrayContaining([
          expect.objectContaining({ postId: posts[0].postId, locked: false, attachment: { type: PostAttachmentType.IMAGE, src: expect.any(String) } }),
          expect.objectContaining({ postId: posts[1].postId, locked: false, attachment: { type: PostAttachmentType.IMAGE, src: expect.any(String) } }),
          expect.objectContaining({ postId: posts[2].postId, locked: false, attachment: { type: PostAttachmentType.VIDEO, src: expect.any(String) } }),
          expect.objectContaining({ postId: posts[3].postId, locked: true, attachment: { type: PostAttachmentType.IMAGE } }),
          expect.objectContaining({ postId: posts[4].postId, locked: true, attachment: { type: PostAttachmentType.VIDEO } }),
        ]));
      });

      it('Should return link as "locked" for locked post', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const squads = [{ ...newSquad(), amount: 100 }, { ...newSquad(), amount: 500 }];
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId,
          squadId: squads[0].squadId,
          amount: squads[0].amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        const posts = [
          { ...newPost(undefined, undefined, faker.internet.url()), squadId: '' },
          { ...newPost(undefined, undefined, faker.internet.url()), squadId: squads[0].squadId },
          { ...newPost(undefined, undefined, faker.internet.url()), squadId: squads[0].squadId },
          { ...newPost(undefined, undefined, faker.internet.url()), squadId: squads[1].squadId },
          { ...newPost(undefined, undefined, faker.internet.url()), squadId: squads[1].squadId },
        ];
        mockPostsData.fetchAllPostsByUserId.mockResolvedValueOnce(posts);
        mockSquadsData.fetchAllSquadsByUserId.mockResolvedValueOnce(squads);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);

        const postsReturned = await findPost.findPostsByUserId({ userId, creatorUserId });
        expect(postsReturned).toEqual(expect.arrayContaining([
          expect.objectContaining({ postId: posts[0].postId, locked: false, link: expect.any(String) }),
          expect.objectContaining({ postId: posts[1].postId, locked: false, link: expect.any(String) }),
          expect.objectContaining({ postId: posts[2].postId, locked: false, link: expect.any(String) }),
          expect.objectContaining({ postId: posts[3].postId, locked: true, link: 'locked' }),
          expect.objectContaining({ postId: posts[4].postId, locked: true, link: 'locked' }),
        ]));
      });
    });

    describe('findPostById', () => {
      it('Should return post as accessible if user is subscribed to the same squad', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId: squad.userId,
          squadId: squad.squadId,
          amount: squad.amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        const post = { ...newPost(), userId: squad.userId, squadId: squad.squadId };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({ postId: post.postId, locked: false }));
      });

      it('Should return null if post does not exist', async () => {
        const userId = id.createId();
        mockPostsData.fetchPostById.mockResolvedValueOnce(null);
        await expect(findPost.findPostById({ userId, postId: id.createId() })).resolves.toStrictEqual(null);
      });

      it('Should return post as accessible if post is free', async () => {
        const userId = id.createId();
        const creatorUserId = id.createId();
        const post = { ...newPost(), userId: creatorUserId, squadId: '' };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({ postId: post.postId, locked: false }));
      });

      it('Should return post as locked if user has no access', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const post = { ...newPost(), userId: squad.userId, squadId: squad.squadId };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(null);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({ postId: post.postId, locked: true }));
      });

      it('Should not have image attachment src field if post is locked', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const attachment = await newPostAttachment(PostAttachmentType.IMAGE);
        const post = { ...newPost(undefined, attachment), userId: squad.userId, squadId: squad.squadId };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(null);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({
          postId: post.postId,
          locked: true,
          attachment: { type: PostAttachmentType.IMAGE },
        }));
      });

      it('Should have image attachment src field if post is not locked', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const attachment = await newPostAttachment(PostAttachmentType.IMAGE);
        const post = { ...newPost(undefined, attachment), userId: squad.userId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId: squad.userId,
          squadId: squad.squadId,
          amount: squad.amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({
          postId: post.postId,
          locked: false,
          attachment: {
            type: PostAttachmentType.IMAGE,
            src: expect.any(String),
          },
        }));
      });

      it('Should not have video attachment src field if post is locked', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const attachment = await newPostAttachment(PostAttachmentType.VIDEO);
        const post = { ...newPost(undefined, attachment), userId: squad.userId, squadId: squad.squadId };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(null);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({
          postId: post.postId,
          locked: true,
          attachment: { type: PostAttachmentType.VIDEO },
        }));
      });

      it('Should have video attachment src field if post is not locked', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const attachment = await newPostAttachment(PostAttachmentType.VIDEO);
        const post = { ...newPost(undefined, attachment), userId: squad.userId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId: squad.userId,
          squadId: squad.squadId,
          amount: squad.amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({
          postId: post.postId,
          locked: false,
          attachment: {
            type: PostAttachmentType.VIDEO,
            src: expect.any(String),
          },
        }));
      });

      it('Should have link field as "locked" if post is locked', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const link = faker.internet.url();
        const post = { ...newPost(undefined, undefined, link), userId: squad.userId, squadId: squad.squadId };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(null);
        const postReturned = await findPost.findPostById({ userId, postId: post.postId });
        expect(postReturned).toStrictEqual(expect.objectContaining({
          postId: post.postId,
          locked: true,
          link: 'locked',
        }));
      });

      it('Should have link if post is not locked', async () => {
        const userId = id.createId();
        const squad = { ...newSquad(), amount: 100 };
        const link = faker.internet.url();
        const post = { ...newPost(undefined, undefined, link), userId: squad.userId, squadId: squad.squadId };
        const manualSub = {
          ...newManualSub(),
          userId,
          creatorUserId: squad.userId,
          squadId: squad.squadId,
          amount: squad.amount,
          subscriptionStatus: ManualSubStatuses.ACTIVE,
        };
        mockPostsData.fetchPostById.mockResolvedValueOnce(post);
        mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
        mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
        await expect(findPost.findPostById({ userId, postId: post.postId })).resolves.toStrictEqual(expect.objectContaining({
          postId: post.postId,
          locked: false,
          link: expect.not.stringMatching('locked'),
        }));
      });

      describe('PostId validation', () => {
        const userId = id.createId();
        [12345, '2181029e1201201jwfdca'].forEach((postId: any) => {
          it(`Should throw error for ${postId}`, async () => {
            await expect(findPost.findPostById({ userId, postId })).rejects.toThrow(ValidationError);
          });
        });
      });
    });
  });
});
