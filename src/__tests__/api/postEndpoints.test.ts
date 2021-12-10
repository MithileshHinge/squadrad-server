import request from 'supertest';
import { Collection, Document, ObjectId } from 'mongodb';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import postParams from '../__mocks__/post/postParams';
import { getLoggedInUser } from '../__mocks__/user/users';

describe('Post endpoints', () => {
  let userCollection: Collection<Document>;
  let creatorCollection: Collection<Document>;
  let postCollection: Collection<Document>;

  beforeEach(async () => {
    userCollection = await (await mockDb()).createCollection('users');
    creatorCollection = await (await mockDb()).createCollection('creators');
    postCollection = await (await mockDb()).createCollection('posts');
  });

  afterEach(async () => {
    await userCollection.drop();
    await creatorCollection.drop();
    await postCollection.drop();
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /post', () => {
    it('Creator can create post', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const res = await agent.post('/post').send(postParams).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ postId: expect.any(String) }));
      await expect(postCollection.findOne({ _id: new ObjectId(res.body.postId), userId })).resolves.toBeTruthy();
    });

    it('Respond with error code 403 (Forbidden) if user is not a creator', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      await agent.post('/post').send({ ...postParams }).expect(HTTPResponseCode.FORBIDDEN);
      await expect(postCollection.findOne({ userId })).resolves.toBeFalsy();
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      await request(app).post('/post').send(postParams).expect(HTTPResponseCode.UNAUTHORIZED);
    });

    it('Respond with error code 400 (Bad Request) if params are invalid', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      await agent.post('/post').send({
        title: 123, description: 1234,
      }).expect(HTTPResponseCode.BAD_REQUEST);
      await expect(postCollection.findOne({ userId })).resolves.toBeFalsy();
    });
  });
});
