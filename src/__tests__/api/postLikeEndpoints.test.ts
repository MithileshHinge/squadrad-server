/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { Collection, Document, ObjectId } from 'mongodb';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import id from '../../common/id';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import faker from '../__mocks__/faker';
import newPost from '../__mocks__/post/posts';
import { getCreatorWithSquads } from '../__mocks__/squad/squads';
import { getLoggedInUser } from '../__mocks__/user/users';

describe('PostLike endpoints', () => {
  let userCollection: Collection<Document>;
  let creatorCollection: Collection<Document>;
  let squadCollection: Collection<Document>;
  let postCollection: Collection<Document>;
  let postLikesCollection: Collection<Document>;

  beforeEach(async () => {
    const db = await mockDb();
    userCollection = await db.createCollection('users');
    creatorCollection = await db.createCollection('creators');
    squadCollection = await db.createCollection('squads');
    postCollection = await db.createCollection('posts');
    postLikesCollection = await db.createCollection('postLikes');

    const { userId, squads } = await getCreatorWithSquads(app, userCollection, squadCollection, 2);
    const samplePosts = [
      { ...newPost(), userId, squadId: '' },
      { ...newPost(), userId, squadId: squads[0].squadId },
      { ...newPost(), userId, squadId: squads[1].squadId },
    ];
    await postCollection.insertMany(samplePosts.map(({ postId, ...postInfo }) => ({
      _id: new ObjectId(postId),
      ...postInfo,
    })));

    const userIdArr1: string[] = [];
    for (let i = 0; i < faker.datatype.number({ min: 1, max: 10, precision: 1 }); i += 1) {
      userIdArr1.push(id.createId());
    }
    const userIdArr2: string[] = [];
    for (let i = 0; i < faker.datatype.number({ min: 1, max: 10, precision: 1 }); i += 1) {
      userIdArr2.push(id.createId());
    }
    await postLikesCollection.insertMany([{ _id: new ObjectId(samplePosts[0].postId), users: userIdArr1 }, { _id: new ObjectId(samplePosts[1].postId), users: userIdArr2 }]);
  });

  afterEach(async () => {
    await userCollection.drop();
    await creatorCollection.drop();
    await squadCollection.drop();
    await postCollection.drop();
    await postLikesCollection.drop();
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /like/:postId', () => {
    it('User can like an unliked post', async () => {
      const { agent } = await getLoggedInUser(app, userCollection);
      const post = await postCollection.find().next();
      const postLikeItem = await postLikesCollection.findOne({ _id: post!._id });
      const res = await agent.post(`/like/${post!._id}`).expect(HTTPResponseCode.OK);
      if (postLikeItem) expect(res.body.numLikes).toBe(postLikeItem.users.length + 1);
      else expect(res.body.numLikes).toBe(1);
    });

    it('User can unlike a liked post', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      const post = await postCollection.find().next();
      await postLikesCollection.updateOne({ _id: post!._id }, { $push: { users: userId } }, { upsert: true });
      const postLikeItem = await postLikesCollection.findOne({ _id: post!._id });
      const res = await agent.post(`/like/${post!._id}`).expect(HTTPResponseCode.OK);
      expect(res.body.numLikes).toBe(postLikeItem!.users.length - 1);
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      const post = await postCollection.find().next();
      const postLikeItemBefore = await postLikesCollection.findOne({ _id: post!._id });
      let numLikesBefore: number;
      if (postLikeItemBefore) numLikesBefore = postLikeItemBefore.users.length;
      else numLikesBefore = 0;
      await request(app).post(`/like/${post!._id}`).expect(HTTPResponseCode.UNAUTHORIZED);
      const postLikeItemAfter = await postLikesCollection.findOne({ _id: post!._id });
      let numLikesAfter: number;
      if (postLikeItemAfter) numLikesAfter = postLikeItemAfter.users.length;
      else numLikesAfter = 0;
      expect(numLikesBefore).toBe(numLikesAfter);
    });

    it('Respond with error code 400 (Bad Request) if postId is invalid', async () => {
      const { agent } = await getLoggedInUser(app, userCollection);
      await agent.post('/like/1234567').expect(HTTPResponseCode.BAD_REQUEST);
    });
  });

  describe('GET /like/:postId', () => {
    it('User can get a true if he has liked the post', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      const post = await postCollection.find().next();
      await postLikesCollection.updateOne({ _id: post!._id }, { $push: { users: userId } }, { upsert: true });
      const res = await agent.get(`/like/${post!._id}`).expect(HTTPResponseCode.OK);
      expect(res.body.isPostLiked).toBe(true);
    });

    it('User can get a false if he has not liked the post', async () => {
      const { agent } = await getLoggedInUser(app, userCollection);
      const post = await postCollection.find().next();
      const res = await agent.get(`/like/${post!._id}`).expect(HTTPResponseCode.OK);
      expect(res.body.isPostLiked).toBe(false);
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      const post = await postCollection.find().next();
      await request(app).get(`/like/${post!._id}`).expect(HTTPResponseCode.UNAUTHORIZED);
    });

    it('Respond with error code 400 (Bad Request) if postId is invalid', async () => {
      const { agent } = await getLoggedInUser(app, userCollection);
      await agent.get('/like/1234567').expect(HTTPResponseCode.BAD_REQUEST);
    });
  });

  describe('GET /likes/:postId', () => {
    it('Anyone can get number of likes on a post', async () => {
      const post = await postCollection.findOne();
      const postLikesItem = await postLikesCollection.findOne({ _id: post!._id });
      const res = await request(app).get(`/likes/${post!._id}`).expect(HTTPResponseCode.OK);
      if (postLikesItem) expect(res.body.numLikes).toBe(postLikesItem.users.length);
      else expect(res.body.numLikes).toBe(0);
    });

    it('Respond with error code 400 (Bad Request) if postId is invalid', async () => {
      await request(app).get('/likes/123456').expect(HTTPResponseCode.BAD_REQUEST);
    });
  });
});
