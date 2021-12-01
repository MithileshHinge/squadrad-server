import { Collection, Document, ObjectId } from 'mongodb';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import SquadsData from '../../database/SquadsData';
import newCreator from '../__mocks__/creator/creators';
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

  describe('fetchSquadBySquadId', () => {
    it('Can fetch squad by squadId', async () => {
      const { squadId, ...squadInfo } = newSquad();
      await squadsCollection.insertOne({
        _id: new ObjectId(squadId),
        ...squadInfo,
      });
      await expect(squadsData.fetchSquadBySquadId(squadId)).resolves.toStrictEqual(expect.objectContaining({ squadId }));
    });

    it('Return null if squad not found', async () => {
      const { squadId } = newSquad();
      await expect(squadsData.fetchSquadBySquadId(squadId)).resolves.toBeNull();
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

  describe('fetchAllSquadsByUserId', () => {
    it('Can fetch all squads by userId', async () => {
      const creator = newCreator();
      const squads = [
        { ...newSquad(), userId: creator.userId },
        { ...newSquad(), userId: creator.userId },
        { ...newSquad(), userId: creator.userId },
      ];
      const sampleSquads = squads.map(({ squadId, ...squadInfo }) => ({
        _id: new ObjectId(squadId),
        ...squadInfo,
      }));
      squadsCollection.insertMany(sampleSquads);

      await expect(squadsData.fetchAllSquadsByUserId(creator.userId)).resolves.toStrictEqual(squads);
    });

    it('Returns empty array if there are no squads for given userId', async () => {
      const creator = newCreator();
      await expect(squadsData.fetchAllSquadsByUserId(creator.userId)).resolves.toStrictEqual([]);
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
