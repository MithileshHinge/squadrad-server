import SetProfilePic from '../../api/profile-pic/SetProfilePic';
import mockUserRepo from '../__mocks__/repositories/mockUserRepo';
import sampleUsers from '../__mocks__/user/users';

describe('Profile Pic Use Cases', () => {
  describe('Set profile pic', () => {
    const setProfilePic = new SetProfilePic(mockUserRepo);

    it('Set a new profile pic', () => {
      const user = sampleUsers[0];
      const newSrc = 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      setProfilePic.setNew(user.userId, newSrc);
      expect(mockUserRepo.updateProfilePic).toHaveBeenCalledWith(user.userId, expect.any(String));
    });
  });
});
