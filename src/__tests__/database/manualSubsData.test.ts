import { Collection, Document, ObjectId } from 'mongodb';
import id from '../../common/id';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import ManualSubsData from '../../database/ManualSubsData';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import newManualSub from '../__mocks__/manual-sub/manualSubs';

describe('ManualSubs data access gateway', () => {
  const manualSubsData = new ManualSubsData(mockDb, handleDatabaseError);
  let manualSubsCollection: Collection<Document>;

  beforeEach(async () => {
    manualSubsCollection = await (await mockDb()).createCollection('manualSubs');
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('manualSubs');
  });

  afterAll(async () => {
    closeConnection();
  });

  describe('insertNewManualSub', () => {
    it('Can insert new manual subscription record', async () => {
      const manualSub = newManualSub();
      await expect(manualSubsData.insertNewManualSub(manualSub)).resolves.not.toThrowError();
      await expect(manualSubsCollection.findOne({ _id: new ObjectId(manualSub.manualSubId) })).resolves.toBeTruthy();
    });
  });

  describe('fetchManualSubById', () => {
    it('Can fetch manualSub by Id', async () => {
      const { manualSubId, ...manualSubInfo } = newManualSub();
      await manualSubsCollection.insertOne({
        _id: new ObjectId(manualSubId),
        ...manualSubInfo,
      });

      await expect(manualSubsData.fetchManualSubById(manualSubId)).resolves.toStrictEqual({ manualSubId, ...manualSubInfo });
    });

    it('Return null if manualSub not found', async () => {
      const manualSubId = id.createId();
      await expect(manualSubsData.fetchManualSubById(manualSubId)).resolves.toStrictEqual(null);
    });
  });

  describe('fetchManualSubByUserIds', () => {
    it('Can fetch manualSub by userIds', async () => {
      const { manualSubId, ...manualSubInfo } = newManualSub();
      await manualSubsCollection.insertOne({
        _id: new ObjectId(manualSubId),
        ...manualSubInfo,
      });

      await expect(manualSubsData.fetchManualSubByUserIds(manualSubInfo.userId, manualSubInfo.creatorUserId)).resolves.toStrictEqual({ manualSubId, ...manualSubInfo });
    });

    it('Return null if manualSub not found', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      await expect(manualSubsData.fetchManualSubByUserIds(userId, creatorUserId)).resolves.toStrictEqual(null);
    });
  });
});
