import { Collection, Document, ObjectId } from 'mongodb';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import ProfilePicsData from '../../database/ProfilePicsData';
import id from '../../common/id';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import { newUser } from '../__mocks__/user/users';

describe('Profile Pics data access gateway', () => {
  const profilePicsData = new ProfilePicsData(mockDb, handleDatabaseError);
  let userCollection: Collection<Document>;
  beforeEach(async () => {
    userCollection = await (await mockDb()).createCollection('users');
  });

  describe('updateProfilePic', () => {
    it('Can update profile picture', async () => {
      // insert new user
      const { userId, ...userInfo } = newUser();
      await userCollection.insertOne({
        _id: new ObjectId(userId),
        ...userInfo,
      });
      const newProfilePicSrc = '/src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      await expect(profilePicsData.updateProfilePic(userId, newProfilePicSrc))
        .resolves.not.toThrowError();
      await expect(userCollection.findOne({ _id: new ObjectId(userId) }))
        .resolves.toStrictEqual(expect.objectContaining({ profilePicSrc: newProfilePicSrc }));
    });
  });

  describe('fetchProfilePic', () => {
    it('Can fetch profile picture', async () => {
      const { userId, ...userInfo } = newUser();
      const profilePicSrc = '/src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
      await userCollection.insertOne({
        _id: new ObjectId(userId),
        ...userInfo,
        profilePicSrc,
      });
      await profilePicsData.updateProfilePic(userId, profilePicSrc);
      await expect(profilePicsData.fetchProfilePic(userId)).resolves.toMatch(profilePicSrc);
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
