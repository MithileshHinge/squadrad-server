import request from 'supertest';
import { Collection, Document, ObjectId } from 'mongodb';
import fs from 'fs-extra';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import postParams from '../__mocks__/post/postParams';
import { getLoggedInUser } from '../__mocks__/user/users';
import { getCreatorWithSquads } from '../__mocks__/squad/squads';
import newPost from '../__mocks__/post/posts';
import newManualSub from '../__mocks__/manual-sub/manualSubs';
import ManualSubStatuses from '../../manual-sub/ManualSubStatuses';
import { PostAttachmentType } from '../../post-attachment/IPostAttachment';
import fileValidator from '../../common/validators/fileValidator';
import { removeUndefinedKeys } from '../../common/helpers';
import faker from '../__mocks__/faker';
import config from '../../config';

describe('Post endpoints', () => {
  let userCollection: Collection<Document>;
  let creatorCollection: Collection<Document>;
  let squadCollection: Collection<Document>;
  let postCollection: Collection<Document>;
  let manualSubCollection: Collection<Document>;

  beforeEach(async () => {
    const db = await mockDb();
    userCollection = await db.createCollection('users');
    creatorCollection = await db.createCollection('creators');
    squadCollection = await db.createCollection('squads');
    postCollection = await db.createCollection('posts');
    manualSubCollection = await db.createCollection('manualSubs');
  });

  afterEach(async () => {
    await userCollection.drop();
    await creatorCollection.drop();
    await squadCollection.drop();
    await postCollection.drop();
    await manualSubCollection.drop();
    fs.emptyDir(config.postAttachmentsDir);
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /post/:type?', () => {
    it('Creator can create post', async () => {
      const { agent, userId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 1);
      const sendData: any = { ...postParams, squadId: squads[0].squadId };
      removeUndefinedKeys(sendData);
      const res = await agent.post('/post').field(sendData).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ postId: expect.any(String) }));
      await expect(postCollection.findOne({ _id: new ObjectId(res.body.postId), userId })).resolves.toBeTruthy();
    });

    it('Creator can create a link post', async () => {
      const { agent, userId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 1);
      const sendData: any = {
        ...postParams, squadId: squads[0].squadId, link: faker.internet.url(),
      };
      removeUndefinedKeys(sendData);
      const res = await agent.post('/post').field(sendData).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ postId: expect.any(String) }));
      await expect(postCollection.findOne({ _id: new ObjectId(res.body.postId), userId })).resolves.toBeTruthy();
    });

    it('Creator can create an image post', async () => {
      const { agent, userId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 1);
      const sendData: any = { ...postParams, squadId: squads[0].squadId };
      removeUndefinedKeys(sendData);
      const res = await agent.post(`/post/${PostAttachmentType.IMAGE}`).field(sendData).attach('postImage', 'src/__tests__/__mocks__/post/brownpaperbag-comic.jpg').expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ postId: expect.any(String) }));
      await expect(postCollection.findOne({ _id: new ObjectId(res.body.postId), userId })).resolves.toBeTruthy();
      expect(fileValidator.fileExists(`${config.postAttachmentsDir}/${res.body.attachment.attachmentId}`)).toBeTruthy();
    });

    it('Creator can create a video post', async () => {
      const { agent, userId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 1);
      const sendData: any = { ...postParams, squadId: squads[0].squadId };
      removeUndefinedKeys(sendData);
      const res = await agent.post(`/post/${PostAttachmentType.VIDEO}`).field(sendData).attach('postVideo', 'src/__tests__/__mocks__/post/bojackhorseman-princesscarolyn.mp4').expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ postId: expect.any(String) }));
      await expect(postCollection.findOne({ _id: new ObjectId(res.body.postId), userId })).resolves.toBeTruthy();
      expect(fileValidator.fileExists(`${config.postAttachmentsDir}/${res.body.attachment.attachmentId}`)).toBeTruthy();
    });

    it('Respond with error code 403 (Forbidden) if user is not a creator', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      const sendData: any = { ...postParams };
      removeUndefinedKeys(sendData);
      await agent.post('/post').field(sendData).expect(HTTPResponseCode.FORBIDDEN);
      await expect(postCollection.findOne({ userId })).resolves.toBeFalsy();
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      const sendData: any = { ...postParams };
      removeUndefinedKeys(sendData);
      await request(app).post('/post').field(sendData).expect(HTTPResponseCode.UNAUTHORIZED);
    });

    it('Respond with error code 400 (Bad Request) if params are invalid', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const sendData: any = {
        description: 1234,
        squadId: 1234,
      };
      await agent.post('/post').field(sendData).expect(HTTPResponseCode.BAD_REQUEST);
      await expect(postCollection.findOne({ userId })).resolves.toBeFalsy();
    });
  });

  describe('GET /posts/:creatorUserId', () => {
    it('Creator can get all his posts', async () => {
      const { agent, userId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 2);
      const samplePosts = [
        { ...newPost(), userId, squadId: '' },
        { ...newPost(), userId, squadId: squads[0].squadId },
        { ...newPost(), userId, squadId: squads[1].squadId },
      ];
      postCollection.insertMany(samplePosts.map(({ postId, ...postInfo }) => ({
        _id: new ObjectId(postId),
        ...postInfo,
      })));

      const { body: posts } = await agent.get(`/posts/${userId}`).expect(HTTPResponseCode.OK);
      expect(posts.length).toBe(3);
    });

    it('User can get all free posts of a creator', async () => {
      const { userId: creatorUserId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 2);

      const samplePosts = [
        { ...newPost(), userId: creatorUserId, squadId: '' },
        { ...newPost(), userId: creatorUserId, squadId: '' },
        { ...newPost(), userId: creatorUserId, squadId: squads[0].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[1].squadId },
      ];
      postCollection.insertMany(samplePosts.map(({ postId, ...postInfo }) => ({
        _id: new ObjectId(postId),
        ...postInfo,
      })));

      const { agent } = await getLoggedInUser(app, userCollection);
      const { body: posts } = await agent.get(`/posts/${creatorUserId}`).expect(HTTPResponseCode.OK);
      expect(posts.length).toBe(2);
    });

    it('User can get all posts from squads with amount less than subscribed amount', async () => {
      const { userId: creatorUserId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 3);
      squads.sort((squad1, squad2) => squad1.amount - squad2.amount);

      const samplePosts = [
        { ...newPost(), userId: creatorUserId, squadId: '' },
        { ...newPost(), userId: creatorUserId, squadId: squads[0].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[0].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[1].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[1].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[1].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[2].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[2].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[2].squadId },
        { ...newPost(), userId: creatorUserId, squadId: squads[2].squadId },
      ];
      postCollection.insertMany(samplePosts.map(({ postId, ...postInfo }) => ({
        _id: new ObjectId(postId),
        ...postInfo,
      })));

      const { agent, userId } = await getLoggedInUser(app, userCollection);
      const { manualSubId, ...manualSubInfo } = {
        ...newManualSub(),
        userId,
        creatorUserId,
        squadId: squads[1].squadId,
        amount: squads[1].amount,
        subscriptionStatus: ManualSubStatuses.ACTIVE,
      };
      await manualSubCollection.insertOne({ _id: new ObjectId(manualSubId), ...manualSubInfo });
      const { body: posts } = await agent.get(`/posts/${creatorUserId}`).expect(HTTPResponseCode.OK);
      expect(posts.length).toBe(6);
    });
  });

  describe(`GET ${config.postAttachmentsDir}/:attachmentId`, () => {
    it('Creator can get his post attachment file', async () => {
      const { agent, userId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 1);
      const sendData: any = { ...postParams, squadId: squads[0].squadId };
      removeUndefinedKeys(sendData);
      const { body: postAdded } = await agent.post(`/post/${PostAttachmentType.IMAGE}`).attach('postImage', 'src/__tests__/__mocks__/post/brownpaperbag-comic.jpg').field(sendData).expect(HTTPResponseCode.OK);
      expect(fileValidator.fileExists(`${config.postAttachmentsDir}/${postAdded.attachment.attachmentId}`)).toBeTruthy();
      const { body: posts } = await agent.get(`/posts/${userId}`).expect(HTTPResponseCode.OK);
      const attachmentSrc = posts[0].attachment.src;
      await agent.get(`/${attachmentSrc}`).expect(HTTPResponseCode.OK).expect('Content-Type', 'application/octet-stream');
    });
  });
});
