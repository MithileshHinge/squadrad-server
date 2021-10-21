import id from '../../common/id';
import CreateUserId from '../../userId/CreateUserId';
import mockUsersData from '../__mocks__/user/mockUsersData';

describe('UserId Use cases', () => {
  describe('Create user Id', () => {
    const createUserId = new CreateUserId(id);

    it('userId must be unique', async () => {
      const userIdSet = new Set();
      for (let i = 0; i < 5; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        userIdSet.add(await createUserId.create(mockUsersData));
      }
      expect(userIdSet.size).toBe(5);
    });
  });
});
