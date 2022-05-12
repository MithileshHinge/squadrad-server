/* eslint-disable no-underscore-dangle */
import { Collection, Document, ObjectId } from 'mongodb';
import app from '../../api/server';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import faker from '../__mocks__/faker';
import newPost from '../__mocks__/post/posts';
import { getLoggedInUser } from '../__mocks__/user/users';

describe('Comments endpoints', () => {
  let userCollection: Collection<Document>;
  let creatorCollection: Collection<Document>;
  let postCollection: Collection<Document>;
  let commentCollection: Collection<Document>;

  beforeEach(async () => {
    const db = await mockDb();
    userCollection = await db.createCollection('users');
    creatorCollection = await db.createCollection('creators');
    postCollection = await db.createCollection('posts');
    commentCollection = await db.createCollection('comments');

    const { userId } = await getLoggedInCreator(app, userCollection);
    const samplePosts = [{ ...newPost(), userId }, { ...newPost(), userId }, { ...newPost(), userId }];
    await postCollection.insertMany(samplePosts.map(({ postId, ...postInfo }) => ({
      _id: new ObjectId(postId),
      ...postInfo,
    })));
  });

  afterEach(async () => {
    await userCollection.drop();
    await creatorCollection.drop();
    await postCollection.drop();
    await commentCollection.drop();
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /comment/:postId', () => {
    it('Logged in user can add a comment on a post', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      const post = await postCollection.find().next();
      const res = await agent.post(`/comment/${post?._id.toString()}`).send({ text: faker.lorem.sentences(2) });
      expect(res.body).toStrictEqual(expect.objectContaining({ userId, postId: post?._id.toString() }));
      await expect(commentCollection.findOne({ userId, postId: post?._id.toString() })).resolves.toBeTruthy();
    });

    xit('Logged in user can add a reply to a comment', async () => {});
    xit('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {});
  });

  describe('GET /comments/:postId', () => {
    xit('Logged in user can get all comments on a post', async () => {});
    xit('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {});
  });
});
