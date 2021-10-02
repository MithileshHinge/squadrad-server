/* eslint-disable no-underscore-dangle */
import { Collection, Document, ObjectId } from 'mongodb';
import DatabaseError from '../../common/errors/DatabaseError';
import UsersData from '../../database/UsersData';
import id from '../../user/id';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import sampleUsers, { newUser } from '../__mocks__/user/users';

describe('Users data access gateway', () => {
  const usersData = new UsersData(mockDb);
  let userCollection: Collection<Document>;
  beforeEach(async () => {
    userCollection = (await mockDb()).collection('users');
    await userCollection.insertMany(sampleUsers.map((user) => {
      const { userId, ...tempUser } = user;
      return {
        _id: new ObjectId(user.userId),
        ...tempUser,
      };
    }));
  });

  describe('insertNewUser', () => {
    it('Can insert new user', async () => {
      const user = newUser();
      await usersData.insertNewUser(user);
      await expect(userCollection.findOne({ _id: new ObjectId(user.userId) }))
        .resolves.toBeTruthy();
    });

    it('Should throw error if blank userId is provided', async () => {
      const user = newUser();
      await expect(usersData.insertNewUser({ ...user, userId: '' })).rejects.toThrow(DatabaseError);
    });

    it('Should throw error if duplicate userId are provided', async () => {
      const user = sampleUsers[0];
      await expect(usersData.insertNewUser(user)).rejects.toThrow(DatabaseError);
    });
  });

  describe('fetchUserById', () => {
    it('Can fetch user by id', async () => {
      const { userId } = sampleUsers[0];
      await expect(usersData.fetchUserById(userId))
        .resolves.toStrictEqual(expect.objectContaining({ userId }));
    });

    it('Return null if user id does not exist', async () => {
      const userId = id.createId();
      await expect(usersData.fetchUserById(userId)).resolves.toBeNull();
    });
  });

  describe('fetchUserByEmail', () => {
    it('Can fetch user by email', async () => {
      const { userId, email } = sampleUsers[0];
      await expect(usersData.fetchUserByEmail(email))
        .resolves.toStrictEqual(expect.objectContaining({ userId }));
    });

    it('Return null if email does not exist', async () => {
      const email = 'aenfajekfan@gmail.com';
      await expect(usersData.fetchUserByEmail(email)).resolves.toBeNull();
    });
  });

  describe('updateUser', () => {
    it('Update full name', async () => {
      const { userId } = sampleUsers[0];
      const fullName = 'nasdjna aacadaas';
      await usersData.updateUser({ userId, fullName });
      await expect(usersData.updateUser({ userId, fullName }))
        .resolves.toStrictEqual(expect.objectContaining({ userId, fullName }));
      await expect(userCollection.findOne({ _id: new ObjectId(userId) }))
        .resolves.toStrictEqual(expect.objectContaining({ fullName }));
    });
  });

  describe('updatePassword', () => {
    it('Can update password', async () => {
      const { userId } = sampleUsers[0];
      const newPassword = 'nqeiwfjqnwekjqnwe';
      await expect(usersData.updatePassword(userId, newPassword)).resolves.not.toThrowError();
      await expect(userCollection.findOne({ _id: new ObjectId(userId) }))
        .resolves.toStrictEqual(expect.objectContaining({ password: newPassword }));
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('users');
  });

  afterAll(() => {
    closeConnection();
  });
});