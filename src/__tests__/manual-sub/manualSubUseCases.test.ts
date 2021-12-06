import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import AddManualSub from '../../manual-sub/AddManualSub';
import FindManualSub from '../../manual-sub/FindManualSub';
import manualSubValidator from '../../manual-sub/validator';
import squadValidator from '../../squad/validator';
import faker from '../__mocks__/faker';
import newManualSub from '../__mocks__/manual-sub/manualSubs';
import mockManualSubsData from '../__mocks__/manual-sub/mockManualSubsData';
import mockSquadsData from '../__mocks__/squad/mockSquadsData';
import newSquad from '../__mocks__/squad/squads';

describe('Manual Sub use cases', () => {
  beforeEach(() => {
    Object.values(mockSquadsData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
    Object.values(mockManualSubsData).forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('AddManualSub use case', () => {
    const addManualSub = new AddManualSub(mockManualSubsData, manualSubValidator, squadValidator);

    it('User can create new manual sub', async () => {
      const {
        userId, creatorUserId, squadId, amount, contactNumber, subscriptionStatus,
      } = newManualSub();
      await expect(addManualSub.add({
        userId, creatorUserId, squadId, amount, contactNumber, subscriptionStatus,
      })).resolves.not.toThrowError();
      expect(mockManualSubsData.insertNewManualSub).toHaveBeenCalled();
    });

    it('Should throw error if contactNumber is invalid', async () => {
      const {
        userId, creatorUserId, squadId, amount, subscriptionStatus,
      } = newManualSub();
      const contactNumber = '434nd43on3';
      await expect(addManualSub.add({
        userId, creatorUserId, squadId, amount, contactNumber, subscriptionStatus,
      })).rejects.toThrow(ValidationError);
      expect(mockManualSubsData.insertNewManualSub).not.toHaveBeenCalled();
    });

    describe('Should throw error if subscriptionStatus is invalid', () => {
      [-1, '0', '1', 5, [1], 'evwoi4fm', null].forEach((subscriptionStatus: any) => {
        it(`Should throw error for ${subscriptionStatus}`, async () => {
          const userId = id.createId();
          const creatorUserId = id.createId();
          const { squadId, amount } = newSquad();
          const contactNumber = faker.phone.phoneNumber('+91##########');
          await expect(addManualSub.add({
            userId, creatorUserId, squadId, amount, contactNumber, subscriptionStatus,
          })).rejects.toThrow(ValidationError);
          expect(mockManualSubsData.insertNewManualSub).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('FindManualSub use case', () => {
    const findManualSub = new FindManualSub(mockManualSubsData, manualSubValidator);

    it('Can find manualSub by id', async () => {
      const manualSub = newManualSub();
      mockManualSubsData.fetchManualSubById.mockResolvedValueOnce(manualSub);
      await expect(findManualSub.findManualSubById(manualSub.manualSubId)).resolves.toStrictEqual(expect.objectContaining({ manualSubId: manualSub.manualSubId }));
      expect(mockManualSubsData.fetchManualSubById).toHaveBeenCalledWith(manualSub.manualSubId);
    });

    it('Returns null if manualSub not found', async () => {
      const manualSubId = id.createId();
      mockManualSubsData.fetchManualSubById.mockResolvedValueOnce(null);
      await expect(findManualSub.findManualSubById(manualSubId)).resolves.toStrictEqual(null);
      expect(mockManualSubsData.fetchManualSubById).toHaveBeenCalledWith(manualSubId);
    });

    it('Should throw error if manualSubId is invalid', async () => {
      const manualSubId: any = 123456;
      await expect(findManualSub.findManualSubById(manualSubId)).rejects.toThrow(ValidationError);
      expect(mockManualSubsData.fetchManualSubById).not.toHaveBeenCalled();
    });

    it('Can find manualSub by userId and creatorUserId', async () => {
      const userId = id.createId();
      const creatorUserId = id.createId();
      const manualSub = newManualSub();
      mockManualSubsData.fetchManualSubByUserIds.mockResolvedValueOnce(manualSub);
      await expect(findManualSub.findManualSubByUserIds(userId, creatorUserId)).resolves.toStrictEqual(expect.objectContaining({ manualSubId: manualSub.manualSubId }));
      expect(mockManualSubsData.fetchManualSubByUserIds).toHaveBeenCalled();
    });
  });
});
