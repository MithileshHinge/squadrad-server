import { Collection, Document, ObjectId } from 'mongodb';
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
});
