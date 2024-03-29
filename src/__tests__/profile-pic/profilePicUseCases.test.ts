import fs from 'fs-extra';
import ValidationError from '../../common/errors/ValidationError';
import GetProfilePic from '../../profile-pic/GetProfilePic';
import SetProfilePic from '../../profile-pic/SetProfilePic';
import profilePicValidator from '../../profile-pic/validator';
import id from '../../common/id';
import mockProfilePicsData from '../__mocks__/profile-pic/mockProfilePicsData';
import sampleUsers from '../__mocks__/user/users';
import { copyFile } from '../../common/helpers';
import config from '../../config';

describe('Profile Pic Use Cases', () => {
  const newSrc = 'sample-profile-pic.jpg';
  beforeEach(async () => {
    const sampleSrc = 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
    await copyFile(sampleSrc, `${config.tmpDir}/${newSrc}`);
  });

  afterEach(async () => {
    await fs.emptyDir(`${config.profilePicsDir}/users`);
    await fs.emptyDir(`${config.profilePicsDir}/creators`);
    await fs.emptyDir(config.tmpDir);
  });

  describe('For user', () => {
    describe('Set profile pic', () => {
      const setProfilePic = new SetProfilePic(mockProfilePicsData, profilePicValidator);

      it('Set a new profile pic', async () => {
        const user = sampleUsers[0];
        await setProfilePic.setNew(user.userId, newSrc, false);
        expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
          user.userId,
          expect.any(String),
          false,
        );
      });

      it('Throw error if file does not exist', async () => {
        const user = sampleUsers[0];
        const newSrcNonExisting = `${config.tmpDir}/non-existing-sample-profile-pic.jpg`;
        await expect(setProfilePic.setNew(user.userId, newSrcNonExisting, false)).rejects.toThrow(ValidationError);
      });

      it('Set profilepic: Do nothing if user does not exist', async () => {
        const userId = id.createId();
        await setProfilePic.setNew(userId, newSrc, false);
      });

      it('Remove profile picture if user exists', async () => {
        const user = sampleUsers[0];
        await setProfilePic.revertToDefault(user.userId, false);
        expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
          user.userId,
          expect.any(String),
          false,
        );
      });

      it('Remove profilePic: Do nothing if user does not exist', async () => {
        const userId = id.createId();
        await setProfilePic.revertToDefault(userId, false);
      });
    });

    describe('Get profile picture', () => {
      const getProfilePic = new GetProfilePic(mockProfilePicsData);

      it('Get profile picture if user exists', async () => {
        const user = sampleUsers[0];
        mockProfilePicsData.fetchProfilePic.mockResolvedValueOnce(`users/${user.userId}/xyz.jpg`);
        await getProfilePic.get(user.userId, false);
        expect(mockProfilePicsData.fetchProfilePic).toHaveBeenCalledWith(user.userId, false);
      });

      it('Throw error if user does not exist', async () => {
        const userId = id.createId();
        mockProfilePicsData.fetchProfilePic.mockResolvedValueOnce(null);
        await expect(getProfilePic.get(userId, false)).rejects.toThrow(ValidationError);
      });
    });
  });
  describe('For creator', () => {
    describe('Set profile pic', () => {
      const setProfilePic = new SetProfilePic(mockProfilePicsData, profilePicValidator);

      it('Set a new profile pic', async () => {
        const user = sampleUsers[0];
        await setProfilePic.setNew(user.userId, newSrc, true);
        expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
          user.userId,
          expect.any(String),
          true,
        );
      });

      it('Throw error if file does not exist', async () => {
        const user = sampleUsers[0];
        const newSrcNonExisting = `${config.tmpDir}/non-existing-sample-profile-pic.jpg`;
        await expect(setProfilePic.setNew(user.userId, newSrcNonExisting, true)).rejects.toThrow(ValidationError);
      });

      it('Set profilepic: Do nothing if user does not exist or not a creator', async () => {
        const userId = id.createId();
        await setProfilePic.setNew(userId, newSrc, true);
      });

      it('Remove profile picture if user exists and is a creator', async () => {
        const user = sampleUsers[0];
        await setProfilePic.revertToDefault(user.userId, true);
        expect(mockProfilePicsData.updateProfilePic).toHaveBeenCalledWith(
          user.userId,
          expect.any(String),
          true,
        );
      });

      it('Remove profilePic: Do nothing if user does not exist', async () => {
        const userId = id.createId();
        await setProfilePic.revertToDefault(userId, true);
      });
    });

    describe('Get profile picture', () => {
      const getProfilePic = new GetProfilePic(mockProfilePicsData);

      it('Get profile picture if user exists', async () => {
        const user = sampleUsers[0];
        mockProfilePicsData.fetchProfilePic.mockResolvedValueOnce(`creators/${user.userId}/xyz.jpg`);
        await getProfilePic.get(user.userId, true);
        expect(mockProfilePicsData.fetchProfilePic).toHaveBeenCalledWith(user.userId, true);
      });

      it('Throw error if user does not exist', async () => {
        const userId = id.createId();
        mockProfilePicsData.fetchProfilePic.mockResolvedValueOnce(null);
        await expect(getProfilePic.get(userId, true)).rejects.toThrow(ValidationError);
      });
    });
  });
});
