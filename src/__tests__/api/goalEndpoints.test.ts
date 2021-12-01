/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import { Collection, Document, ObjectId } from 'mongodb';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import goalParams from '../__mocks__/goal/goalParams';
import { getLoggedInUser } from '../__mocks__/user/users';
import newGoal from '../__mocks__/goal/goals';
import id from '../../common/id';

describe('Goal endpoints', () => {
  let userCollection: Collection<Document>;
  let creatorCollection: Collection<Document>;
  let goalCollection: Collection<Document>;

  beforeEach(async () => {
    userCollection = await (await mockDb()).createCollection('users');
    creatorCollection = await (await mockDb()).createCollection('creators');
    goalCollection = await (await mockDb()).createCollection('goals');
  });

  afterEach(async () => {
    await userCollection.drop();
    await creatorCollection.drop();
    await goalCollection.drop();
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /goal', () => {
    it('Creator can add goal', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const res = await agent.post('/goal').send({ ...goalParams }).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ goalId: expect.any(String) }));
      await expect(goalCollection.findOne({ _id: new ObjectId(res.body.goalId), userId })).resolves.toBeTruthy();
    });

    it('Respond with error code 403 (Forbidden) if user is not a creator', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      await agent.post('/goal').send({ ...goalParams }).expect(HTTPResponseCode.FORBIDDEN);
      await expect(goalCollection.findOne({ userId })).resolves.toBeFalsy();
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      await request(app).post('/goal').send(goalParams).expect(HTTPResponseCode.UNAUTHORIZED);
    });

    it('Respond with error code 400 (Bad Request) if another goal of same goalNumber exists', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const goalNumber = 1000;
      await agent.post('/goal').send({ ...goalParams, goalNumber }).expect(HTTPResponseCode.OK);
      await agent.post('/goal').send({ ...goalParams, goalNumber }).expect(HTTPResponseCode.BAD_REQUEST);
      const goalsCur = goalCollection.find({ userId, goalNumber });
      await expect(goalsCur.count()).resolves.toBe(1);
    });

    it('Respond with error code 400 (Bad Request) if params are invalid', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      await agent.post('/goal').send({
        title: 123, description: 1234, goalNumber: -100,
      }).expect(HTTPResponseCode.BAD_REQUEST);
      await expect(goalCollection.findOne({ userId })).resolves.toBeFalsy();
    });
  });

  describe('GET /creator/:userId/goals', () => {
    it('Can get all goals of a creator', async () => {
      // insert sample goals into database
      const sampleGoals1 = [newGoal(), newGoal(), newGoal()];
      const userId1 = id.createId();
      await goalCollection.insertMany(sampleGoals1.map((goal) => ({
        ...goal,
        userId: userId1,
      })));

      const sampleGoals2 = [newGoal(), newGoal()];
      const userId2 = id.createId();
      await goalCollection.insertMany(sampleGoals2.map((goal) => ({
        ...goal,
        userId: userId2,
      })));

      const { body: goals1 } = await request(app).get(`/creator/${userId1}/goals`).expect(HTTPResponseCode.OK);
      expect(goals1.length).toBe(3);

      const { body: goals2 } = await request(app).get(`/creator/${userId2}/goals`).expect(HTTPResponseCode.OK);
      expect(goals2.length).toBe(2);
    });

    it('Return empty array if no goals exist', async () => {
      const userId = id.createId();
      const { body: goals } = await request(app).get(`/creator/${userId}/goals`).expect(HTTPResponseCode.OK);
      expect(goals).toStrictEqual([]);
    });

    describe('PATCH /goal/:goalId', () => {
      const { title: editTitle, description: editDescription, goalNumber: editGoalNumber } = newGoal();

      it('Creator can edit goal title', async () => {
        const { agent } = await getLoggedInCreator(app, userCollection);
        const { body: goal } = await agent.post('/goal').send(goalParams).expect(HTTPResponseCode.OK);
        await agent.patch(`/goal/${goal.goalId}`).send({ title: editTitle }).expect(HTTPResponseCode.OK);
        await expect(goalCollection.findOne({ _id: new ObjectId(goal.goalId) })).resolves.toStrictEqual(expect.objectContaining({ title: editTitle }));
      });

      it('Creator can edit goal description', async () => {
        const { agent } = await getLoggedInCreator(app, userCollection);
        const { body: goal } = await agent.post('/goal').send(goalParams).expect(HTTPResponseCode.OK);
        await agent.patch(`/goal/${goal.goalId}`).send({ description: editDescription }).expect(HTTPResponseCode.OK);
        await expect(goalCollection.findOne({ _id: new ObjectId(goal.goalId) })).resolves.toStrictEqual(expect.objectContaining({ description: editDescription }));
      });

      it('Creator can edit goal number', async () => {
        const { agent } = await getLoggedInCreator(app, userCollection);
        const { body: goal } = await agent.post('/goal').send(goalParams).expect(HTTPResponseCode.OK);
        await agent.patch(`/goal/${goal.goalId}`).send({ goalNumber: editGoalNumber }).expect(HTTPResponseCode.OK);
        await expect(goalCollection.findOne({ _id: new ObjectId(goal.goalId) })).resolves.toStrictEqual(expect.objectContaining({ goalNumber: editGoalNumber }));
      });

      it('Creator cannot edit another creators goal', async () => {
        const { agent: agent1, userId } = await getLoggedInCreator(app, userCollection);
        await agent1.post('/goal').send(goalParams).expect(HTTPResponseCode.OK);
        const goal = await goalCollection.findOne({ userId });
        const { agent: agent2 } = await getLoggedInCreator(app, userCollection);
        await agent2.patch(`/goal/${goal!._id.toString()}`).send({ title: editTitle }).expect(HTTPResponseCode.OK);
        await expect(goalCollection.findOne({ _id: goal!._id })).resolves.toStrictEqual(expect.objectContaining(goal));
      });
    });
  });
});
