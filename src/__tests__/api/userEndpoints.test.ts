/* eslint-disable no-underscore-dangle */
import { Collection, Document, ObjectId } from 'mongodb';
import request from 'supertest';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';

import sampleUserParams from '../__mocks__/user/userParams';
import sampleUsers from '../__mocks__/user/users';

describe('User Endpoints', () => {
  let userCollection: Collection<Document>;
  beforeEach(async () => {
    userCollection = (await mockDb()).collection('users');
    await userCollection.insertMany(sampleUsers.map((user) => {
      const { userId, ...tempUser } = user;
      return {
        _id: new ObjectId(userId),
        ...tempUser,
      };
    }));
  });

  describe('POST /user', () => {
    it('Can add new user', async () => {
      await request(app).post('/user').send(sampleUserParams).expect(HTTPResponseCode.CREATED);
      await expect(userCollection.findOne({ email: sampleUserParams.email }))
        .resolves.toStrictEqual(expect.objectContaining({ email: sampleUserParams.email }));
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('users');
  });

  afterAll(async () => {
    closeConnection();
  });
});
