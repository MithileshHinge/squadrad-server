import { Collection, Document, ObjectId } from 'mongodb';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import ProfilePicsData from '../../database/ProfilePicsData';
import id from '../../user/id';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import sampleUsers from '../__mocks__/user/users';

describe('Profile Pics data access gateway', () => {
  const profilePicsData = new ProfilePicsData(mockDb, handleDatabaseError);
  let userCollection: Collection<Document>;
  beforeEach(async () => {
    userCollection = (await mockDb()).collection('users');
    const { userId, ...tempUser } = sampleUsers[0];
    await userCollection.insertOne({
      _id: new ObjectId(userId),
      ...tempUser,
    });
  });

  describe('updateProfilePic', () => {
    it('Can update profile picture', async () => {
      const { userId } = sampleUsers[0];
      const newProfilePicSrc = '/src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      await expect(profilePicsData.updateProfilePic(userId, newProfilePicSrc))
        .resolves.not.toThrowError();
      await expect(userCollection.findOne({ _id: new ObjectId(userId) }))
        .resolves.toStrictEqual(expect.objectContaining({ profilePicSrc: newProfilePicSrc }));
    });
  });

  describe('fetchProfilePic', () => {
    it('Can fetch profile picture', async () => {
      const { userId } = sampleUsers[0];
      const newProfilePicSrc = '/src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      await profilePicsData.updateProfilePic(userId, newProfilePicSrc);
      await expect(profilePicsData.fetchProfilePic(userId)).resolves.toMatch(newProfilePicSrc);
    });

    it('Returns null if user id does not exist', async () => {
      const userId = id.createId();
      await expect(profilePicsData.fetchProfilePic(userId)).resolves.toBeNull();
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('users');
  });

  afterAll(async () => {
    closeConnection();
  });
});
