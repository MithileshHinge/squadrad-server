import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import AddManualSub from '../../manual-sub/AddManualSub';
import FindSquad from '../../squad/FindSquad';
import squadValidator from '../../squad/validator';
import mockManualSubsData from '../__mocks__/manual-sub/mockManualSubsData';
import mockSquadsData from '../__mocks__/squad/mockSquadsData';
import newSquad from '../__mocks__/squad/squads';

describe('Manual Sub use cases', () => {
  describe('AddManualSub use case', () => {
    const findSquad = new FindSquad(mockSquadsData, squadValidator);
    const addManualSub = new AddManualSub(mockManualSubsData, findSquad);

    beforeEach(() => {
      Object.values(mockSquadsData).forEach((mockMethod) => {
        mockMethod.mockClear();
      });
      Object.values(mockManualSubsData).forEach((mockMethod) => {
        mockMethod.mockClear();
      });
    });

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
});
