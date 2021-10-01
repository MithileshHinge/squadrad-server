import ValidationError from '../../common/errors/ValidationError';
import GetProfilePic from '../../profile-pic/GetProfilePic';
import SetProfilePic from '../../profile-pic/SetProfilePic';
import profilePicValidator from '../../profile-pic/validator';
import id from '../../user/id';
import mockProfilePicsData from '../__mocks__/profile-pic/mockProfilePicsData';
import sampleUsers from '../__mocks__/user/users';

describe('Profile Pic Use Cases', () => {
  describe('Set profile pic', () => {
    const setProfilePic = new SetProfilePic(mockProfilePicsData, profilePicValidator);

    it('Set a new profile pic', async () => {
      const user = sampleUsers[0];
      const newSrc = 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      await setProfilePic.setNew(user.userId, newSrc);
      expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
        user.userId,
        expect.any(String),
      );
    });

    it('Throw error if file does not exist', async () => {
      const user = sampleUsers[0];
      const newSrc = 'src/__tests__/__mocks__/profile-pic/non-existing-sample-profile-pic.jpg';
      await expect(setProfilePic.setNew(user.userId, newSrc)).rejects.toThrow(ValidationError);
    });

    it('Set profilepic: Do nothing if user does not exist', async () => {
      const userId = id.createId();
      const newSrc = 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      await setProfilePic.setNew(userId, newSrc);
    });

    it('Remove profile picture if user exists', async () => {
      const user = sampleUsers[0];
      await setProfilePic.revertToDefault(user.userId);
      expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
        user.userId,
        expect.any(String),
      );
    });

    it('Remove profilePic: Do nothing if user does not exist', async () => {
      const userId = id.createId();
      await setProfilePic.revertToDefault(userId);
    });
  });

  describe('Get profile picture', () => {
    const getProfilePic = new GetProfilePic(mockProfilePicsData);

    it('Get profile picture if user exists', async () => {
      const user = sampleUsers[0];
      mockProfilePicsData.fetchProfilePic.mockReturnValueOnce('src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg');
      await getProfilePic.get(user.userId);
      expect(mockProfilePicsData.fetchProfilePic).toHaveBeenCalledWith(user.userId);
    });

    it('Throw error if user does not exist', async () => {
      const userId = id.createId();
      mockProfilePicsData.fetchProfilePic.mockReturnValueOnce(null);
      await expect(getProfilePic.get(userId)).rejects.toThrow(ValidationError);
    });
  });
});
