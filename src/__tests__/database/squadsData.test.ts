import { Collection, Document, ObjectId } from 'mongodb';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import SquadsData from '../../database/SquadsData';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import newSquad from '../__mocks__/squad/squads';

describe('Squads data access gateway', () => {
  const squadsData = new SquadsData(mockDb, handleDatabaseError);
  let squadsCollection: Collection<Document>;

  beforeEach(async () => {
    squadsCollection = await (await mockDb()).createCollection('squads');
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('squads');
  });

  afterAll(async () => {
    closeConnection();
  });

  describe('insertNewSquad', () => {
    it('Can insert new squad', async () => {
      const squad = newSquad();
      await expect(squadsData.insertNewSquad(squad)).resolves.not.toThrowError();
      await expect(squadsCollection.findOne({ _id: new ObjectId(squad.squadId) })).resolves.toBeTruthy();
    });
  });

  describe('fetchSquadByAmount', () => {
    it('Can fetch squad by amount', async () => {
      const { squadId, ...squadInfo } = newSquad();
      await squadsCollection.insertOne({
        _id: new ObjectId(squadId),
        ...squadInfo,
      });
      await expect(squadsData.fetchSquadByAmount({ userId: squadInfo.userId, amount: squadInfo.amount }))
        .resolves.toStrictEqual(expect.objectContaining({ squadId }));
    });
  });

  describe('updateSquad', () => {
    describe('Can update squad', () => {
      const updateParamsArr = ['title', 'description', 'membersLimit'];

      updateParamsArr.forEach((param) => {
        it(`Can update ${param}`, async () => {
          const { userId, squadId, ...squadInfo } = newSquad();
          await squadsCollection.insertOne({
            _id: new ObjectId(squadId),
            userId,
            ...squadInfo,
          });
          const { title, description, membersLimit } = newSquad();
          const updateParams: any = { title, description, membersLimit };
          await expect(squadsData.updateSquad({ userId, squadId, [param]: updateParams[param] })).resolves.toBeTruthy();
          await expect(squadsCollection.findOne({ _id: new ObjectId(squadId) })).resolves.toStrictEqual(expect.objectContaining({ [param]: updateParams[param] }));
        });
      });
    });
  });
});
