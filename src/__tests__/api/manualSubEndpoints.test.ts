import { Collection, Document } from 'mongodb';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import squadParams from '../__mocks__/squad/squadParams';
import { getLoggedInUser } from '../__mocks__/user/users';

describe('Manual Sub Endpoints', () => {
  let usersCollection: Collection<Document>;
  let creatorsCollection: Collection<Document>;
  let squadsCollection: Collection<Document>;
  let manualSubsCollection: Collection<Document>;

  beforeEach(async () => {
    usersCollection = await (await mockDb()).createCollection('users');
    creatorsCollection = await (await mockDb()).createCollection('creators');
    squadsCollection = await (await mockDb()).createCollection('squads');
    manualSubsCollection = await (await mockDb()).createCollection('manualSubs');
  });

  afterEach(async () => {
    await usersCollection.drop();
    await creatorsCollection.drop();
    await squadsCollection.drop();
    await manualSubsCollection.drop();
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /manualSub', () => {
    it('User can subscribe to a squad', async () => {
      const { agent: agentUser } = await getLoggedInUser(app, usersCollection);
      const { agent: agentCreator, userId: creatorUserId } = await getLoggedInCreator(app, usersCollection);
      const { body: squad } = await agentCreator.post('/squad').send(squadParams).expect(HTTPResponseCode.OK);
      const res = await agentUser.post('/manualSub').send({ creatorUserId, squadId: squad.squadId }).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ rzpOrder: expect.anything() }));
    });
  });
});
