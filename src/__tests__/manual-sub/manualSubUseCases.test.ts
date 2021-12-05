import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import AddManualSub from '../../manual-sub/AddManualSub';
import FindManualSub from '../../manual-sub/FindManualSub';
import manualSubValidator from '../../manual-sub/validator';
import FindSquad from '../../squad/FindSquad';
import squadValidator from '../../squad/validator';
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
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const addManualSub = new AddManualSub(mockManualSubsData, findSquad);

    it('User can create new manual sub', async () => {
      const userId = id.createId();
      const squad = { ...newSquad() };
      mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(squad);
      await expect(addManualSub.add({ userId, squadId: squad.squadId })).resolves.not.toThrowError();
      expect(mockManualSubsData.insertNewManualSub).toHaveBeenCalled();
    });

    it('Should throw error if squad does not exist', async () => {
      const userId = id.createId();
      const squadId = id.createId();
      mockSquadsData.fetchSquadBySquadId.mockResolvedValueOnce(null);
      await expect(addManualSub.add({ userId, squadId })).rejects.toThrow(ValidationError);
      expect(mockManualSubsData.insertNewManualSub).not.toHaveBeenCalled();
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
  });
});
