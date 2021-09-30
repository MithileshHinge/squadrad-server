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

    it('Set a new profile pic', () => {
      const user = sampleUsers[0];
      const newSrc = 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      setProfilePic.setNew(user.userId, newSrc);
      expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
        user.userId,
        expect.any(String),
      );
    });

    it('Throw error if file does not exist', () => {
      const user = sampleUsers[0];
      const newSrc = 'src/__tests__/__mocks__/profile-pic/non-existing-sample-profile-pic.jpg';
      expect(() => setProfilePic.setNew(user.userId, newSrc)).toThrow(ValidationError);
    });

    it('Set profilepic: Do nothing if user does not exist', () => {
      const userId = id.createId();
      const newSrc = 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      setProfilePic.setNew(userId, newSrc);
    });

    it('Remove profile picture if user exists', () => {
      const user = sampleUsers[0];
      setProfilePic.revertToDefault(user.userId);
      expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
        user.userId,
        expect.any(String),
      );
    });

    it('Remove profilePic: Do nothing if user does not exist', () => {
      const userId = id.createId();
      setProfilePic.revertToDefault(userId);
    });
  });

  describe('Get profile picture', () => {
    const getProfilePic = new GetProfilePic(mockProfilePicsData);

    it('Get profile picture if user exists', () => {
      const user = sampleUsers[0];
      mockProfilePicsData.fetchProfilePic.mockReturnValueOnce('src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg');
      getProfilePic.get(user.userId);
      expect(mockProfilePicsData.fetchProfilePic).toHaveBeenCalledWith(user.userId);
    });

    it('Throw error if user does not exist', () => {
      const userId = id.createId();
      mockProfilePicsData.fetchProfilePic.mockReturnValueOnce(null);
      expect(() => getProfilePic.get(userId)).toThrow(ValidationError);
    });
  });
});
