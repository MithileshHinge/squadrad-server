import request from 'supertest';
import { Collection, Document, ObjectId } from 'mongodb';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import squadParams from '../__mocks__/squad/squadParams';
import { getLoggedInUser } from '../__mocks__/user/users';

describe('Squad Endpoints', () => {
  let userCollection: Collection<Document>;
  let creatorCollection: Collection<Document>;
  let squadCollection: Collection<Document>;

  beforeEach(async () => {
    userCollection = await (await mockDb()).createCollection('users');
    creatorCollection = await (await mockDb()).createCollection('creators');
    squadCollection = await (await mockDb()).createCollection('squads');
  });

  afterEach(async () => {
    await userCollection.drop();
    await creatorCollection.drop();
    await squadCollection.drop();
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /squad', () => {
    it('Creator can add squad', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const res = await agent.post('/squad').send({ ...squadParams }).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ squadId: expect.any(String) }));
      await expect(squadCollection.findOne({ _id: new ObjectId(res.body.squadId), userId }));
    });

    it('Respond with error code 403 (Forbidden) if user is not a creator', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      await agent.post('/squad').send({ ...squadParams }).expect(HTTPResponseCode.FORBIDDEN);
      await expect(squadCollection.findOne({ userId })).resolves.toBeFalsy();
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      await request(app).post('/squad').send({ ...squadParams }).expect(HTTPResponseCode.UNAUTHORIZED);
    });

    it('Respond with error code 400 (Bad Request) if another squad of same amount exists', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const amount = 50;
      await agent.post('/squad').send({ ...squadParams, amount }).expect(HTTPResponseCode.OK);
      await agent.post('/squad').send({ ...squadParams, amount }).expect(HTTPResponseCode.BAD_REQUEST);
      const squadsCursor = squadCollection.find({ userId, amount });
      await expect(squadsCursor.count()).resolves.toBe(1);
    });

    it('Respond with error code 400 (Bad Request) if params are invalid', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      await agent.post('/squad').send({
        title: 'a', amount: -10, description: 1234, membersLimit: -1,
      }).expect(HTTPResponseCode.BAD_REQUEST);
      await expect(squadCollection.findOne({ userId })).resolves.toBeFalsy();
    });
  });
});
