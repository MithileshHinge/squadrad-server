import { Collection, Document, ObjectId } from 'mongodb';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import GoalsData from '../../database/GoalsData';
import newCreator from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import newGoal from '../__mocks__/goal/goals';

describe('Goals data access gateway', () => {
  const goalsData = new GoalsData(mockDb, handleDatabaseError);
  let goalsCollection: Collection<Document>;

  beforeEach(async () => {
    goalsCollection = await (await mockDb()).createCollection('goals');
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('goals');
  });

  afterAll(async () => {
    closeConnection();
  });

  describe('insertNewGoal', () => {
    it('Can insert new goal', async () => {
      const goal = newGoal();
      await expect(goalsData.insertNewGoal(goal)).resolves.not.toThrowError();
      await expect(goalsCollection.findOne({ _id: new ObjectId(goal.goalId) })).resolves.toBeTruthy();
    });
  });

  describe('fetchGoalByGoalNumber', () => {
    it('Can fetch by goal number', async () => {
      const { goalId, ...goalInfo } = newGoal();
      await goalsCollection.insertOne({
        _id: new ObjectId(goalId),
        ...goalInfo,
      });
      await expect(goalsData.fetchGoalByGoalNumber({ userId: goalInfo.userId, goalNumber: goalInfo.goalNumber }))
        .resolves.toStrictEqual(expect.objectContaining({ goalId }));
    });
  });

  describe('fetchAllGoalsByUserId', () => {
    it('Can fetch all goals by userId', async () => {
      const creator = newCreator();
      const goals = [
        { ...newGoal(), userId: creator.userId },
        { ...newGoal(), userId: creator.userId },
        { ...newGoal(), userId: creator.userId },
      ];

      const sampleGoals = goals.map(({ goalId, ...goalInfo }) => ({
        _id: new ObjectId(goalId),
        ...goalInfo,
      }));
      goalsCollection.insertMany(sampleGoals);

      await expect(goalsData.fetchAllGoalsByUserId(creator.userId)).resolves.toStrictEqual(goals);
    });

    it('Returns empty array if there are not goals for given userId', async () => {
      const creator = newCreator();
      await expect(goalsData.fetchAllGoalsByUserId(creator.userId)).resolves.toStrictEqual([]);
    });
  });

  describe('updateGoal', () => {
    describe('Can update goal', () => {
      const updateParamsArr = ['title', 'description', 'goalNumber'];

      updateParamsArr.forEach((param) => {
        it(`Can update ${param}`, async () => {
          const { userId, goalId, ...goalInfo } = newGoal();
          await goalsCollection.insertOne({
            _id: new ObjectId(goalId),
            userId,
            ...goalInfo,
          });
          const { title, description, goalNumber } = newGoal();
          const updateParams: any = { title, description, goalNumber };
          await expect(goalsData.updateGoal({ userId, goalId, [param]: updateParams[param] })).resolves.toBeTruthy();
          await expect(goalsCollection.findOne({ _id: new ObjectId(goalId) })).resolves.toStrictEqual(expect.objectContaining({ [param]: updateParams[param] }));
        });
      });
    });
  });
});
