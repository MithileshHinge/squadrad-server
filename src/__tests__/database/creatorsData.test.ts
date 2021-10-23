import { Collection, Document, ObjectId } from 'mongodb';
import DatabaseError from '../../common/errors/DatabaseError';
import CreatorsData from '../../database/CreatorsData';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import id from '../../common/id';
import newCreator from '../__mocks__/creator/creators';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import faker from '../__mocks__/faker';

describe('Creators data access gateway', () => {
  const creatorsData = new CreatorsData(mockDb, handleDatabaseError);
  let creatorsCollection: Collection<Document>;
  beforeEach(async () => {
    creatorsCollection = await (await mockDb()).createCollection('creators');
  });

  describe('insertNewCreator', () => {
    it('Can insert new creator', async () => {
      const creator = newCreator();
      await expect(creatorsData.insertNewCreator(creator)).resolves.not.toThrow();
      await expect(creatorsCollection.findOne({ _id: new ObjectId(creator.userId) })).resolves.toBeTruthy();
    });

    it('Shoud throw error if blank userId is provided', async () => {
      const creator = newCreator();
      await expect(creatorsData.insertNewCreator({ ...creator, userId: '' })).rejects.toThrow(DatabaseError);
    });

    it('Should throw error if duplicate userIds are provided', async () => {
      const { userId, ...creatorInfo } = newCreator();
      await creatorsCollection.insertOne({ _id: new ObjectId(userId), ...creatorInfo });
      await expect(creatorsData.insertNewCreator({ userId, ...creatorInfo })).rejects.toThrow(DatabaseError);
    });
  });

  describe('fetchCreatorById', () => {
    it('Can fetch creator by userId', async () => {
      const { userId, ...creatorsInfo } = newCreator();
      await creatorsCollection.insertOne({
        _id: new ObjectId(userId),
        ...creatorsInfo,
      });
      await expect(creatorsData.fetchCreatorById(userId)).resolves.toStrictEqual(expect.objectContaining({ userId }));
    });

    it('Return null if creator with userId does not exist', async () => {
      await expect(creatorsData.fetchCreatorById(id.createId())).resolves.toBeNull();
    });
  });

  describe('updateCreator', () => {
    describe('Can update creator', () => {
      const updateParamsArr = ['pageName', 'bio', 'isPlural', 'showTotalSquadMembers'];

      updateParamsArr.forEach((param) => {
        it(`Can update ${param}`, async () => {
          const { userId, ...creatorsInfo } = newCreator();
          await creatorsCollection.insertOne({
            _id: new ObjectId(userId),
            ...creatorsInfo,
          });
          const updateParams: any = {
            pageName: faker.name.findName(),
            bio: faker.name.findName(),
            isPlural: !creatorsInfo.isPlural,
            showTotalSquadMembers: !creatorsInfo.showTotalSquadMembers,
          };
          await expect(creatorsData.updateCreator({ userId, [param]: updateParams[param] })).resolves.toBeTruthy();
          await expect(creatorsCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining({ [param]: updateParams[param] }));
        });
      });
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('creators');
  });

  afterAll(async () => {
    closeConnection();
  });
});
