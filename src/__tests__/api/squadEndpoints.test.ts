/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { Collection, Document, ObjectId } from 'mongodb';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import squadParams from '../__mocks__/squad/squadParams';
import { getLoggedInUser } from '../__mocks__/user/users';
import faker from '../__mocks__/faker';
import newSquad from '../__mocks__/squad/squads';
import id from '../../common/id';

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

  describe('GET /creator/:userId/squads', () => {
    it('Can get all squads of a creator', async () => {
      // insert sample squads into database
      const sampleSquads1 = [newSquad(), newSquad(), newSquad()];
      const userId1 = id.createId();
      await squadCollection.insertMany(sampleSquads1.map((squad) => ({
        ...squad,
        userId: userId1,
      })));

      const sampleSquads2 = [newSquad(), newSquad()];
      const userId2 = id.createId();
      await squadCollection.insertMany(sampleSquads2.map((squad) => ({
        ...squad,
        userId: userId2,
      })));

      const { body: squads1 } = await request(app).get(`/creator/${userId1}/squads`).expect(HTTPResponseCode.OK);
      expect(squads1.length).toBe(3);

      const { body: squads2 } = await request(app).get(`/creator/${userId2}/squads`).expect(HTTPResponseCode.OK);
      expect(squads2.length).toBe(2);
    });

    it('Return empty array if no squads exist', async () => {
      const userId = id.createId();
      const { body: squads } = await request(app).get(`/creator/${userId}/squads`).expect(HTTPResponseCode.OK);
      expect(squads).toStrictEqual([]);
    });
  });

  describe('PATCH /squad', () => {
    const editSquadParams = {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(5).substr(0, 2000),
      membersLimit: faker.datatype.number({ min: 1, precision: 1 }),
    };

    it('Creator can edit squad title', async () => {
      const { agent } = await getLoggedInCreator(app, userCollection);
      const { body: squad } = await agent.post('/squad').send({ ...squadParams });
      await agent.patch(`/squad/${squad.squadId}`).send({ title: editSquadParams.title }).expect(HTTPResponseCode.OK);
      await expect(squadCollection.findOne({ _id: new ObjectId(squad.squadId) })).resolves.not.toStrictEqual(expect.objectContaining({
        title: squad.title,
      }));
    });

    it('Creator can edit squad description', async () => {
      const { agent } = await getLoggedInCreator(app, userCollection);
      const { body: squad } = await agent.post('/squad').send({ ...squadParams });
      await agent.patch(`/squad/${squad.squadId}`).send({ description: editSquadParams.description }).expect(HTTPResponseCode.OK);
      await expect(squadCollection.findOne({ _id: new ObjectId(squad.squadId) })).resolves.not.toStrictEqual(expect.objectContaining({
        description: squad.description,
      }));
    });

    it('Creator can edit squad membersLimit', async () => {
      const { agent } = await getLoggedInCreator(app, userCollection);
      const { body: squad } = await agent.post('/squad').send({ ...squadParams });
      await agent.patch(`/squad/${squad.squadId}`).send({ membersLimit: editSquadParams.membersLimit }).expect(HTTPResponseCode.OK);
      await expect(squadCollection.findOne({ _id: new ObjectId(squad.squadId) })).resolves.not.toStrictEqual(expect.objectContaining({
        membersLimit: squad.membersLimit,
      }));
    });

    it('Creator cannot change squad amount', async () => {
      const { agent } = await getLoggedInCreator(app, userCollection);
      const { body: squad } = await agent.post('/squad').send({ ...squadParams, amount: 50 });
      await agent.patch(`/squad/${squad.squadId}`).send({ amount: 120 }).expect(HTTPResponseCode.BAD_REQUEST);
      await expect(squadCollection.findOne({ _id: new ObjectId(squad.squadId) })).resolves.toStrictEqual(expect.objectContaining({
        amount: 50,
      }));
    });

    it('Creator cannot edit another creator\'s squad', async () => {
      const { agent: agent1, userId } = await getLoggedInCreator(app, userCollection);
      await agent1.post('/squad').send({ ...squadParams });
      const squad = await squadCollection.findOne({ userId });
      const { agent: agent2 } = await getLoggedInCreator(app, userCollection);
      await agent2.patch(`/squad/${squad!._id.toString()}`).send({ ...editSquadParams }).expect(HTTPResponseCode.OK);
      await expect(squadCollection.findOne({ _id: squad!._id })).resolves.toStrictEqual(expect.objectContaining(squad));
    });
  });
});
