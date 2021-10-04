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

    it('Respond with error code 400 (Bad Request) if parameters are invalid', async () => {
      const invalidParams = {
        fullName: 'm3rn2  csd3',
        email: 'aenfa efaej',
        password: 'rvarv',
      };
      await Promise.all(Object.entries(invalidParams).map(async ([param, value]) => {
        const res = await request(app).post('/user').send({ ...sampleUserParams, [param]: value });
        expect(res.statusCode).toBe(HTTPResponseCode.BAD_REQUEST);
      }));
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('users');
  });

  afterAll(async () => {
    closeConnection();
  });
});
