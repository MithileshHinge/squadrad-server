/* eslint-disable no-underscore-dangle */
import { Collection, Document, ObjectId } from 'mongodb';
import request from 'supertest';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { issueJWT } from '../../common/jwt';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import faker from '../__mocks__/faker';

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

  describe('PATCH /user/verify', () => {
    it('Can verify user', async () => {
      // get unverified user, assuming there is at least one unverified user
      const { email } = sampleUsers.find((user) => !user.verified)!;
      const token = issueJWT({ email }, 100);
      await request(app).patch('/user/verify').send({ token }).expect(HTTPResponseCode.OK);
      await expect(userCollection.findOne({ email }))
        .resolves.toStrictEqual(expect.objectContaining({ verified: true }));
    });

    it('Respond with error code 400 (Bad Request) if email id does not exist', async () => {
      const email = faker.internet.email();
      const token = issueJWT({ email }, 100);
      await request(app).patch('/user/verify').send({ token }).expect(HTTPResponseCode.BAD_REQUEST);
    });

    it('Respond with error code 403 (Forbidden) if token is expired', async () => {
      const { email } = sampleUsers.find((user) => !user.verified)!;
      const token = issueJWT({ email }, 2);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 3000);
      });
      await request(app).patch('/user/verify').send({ token }).expect(HTTPResponseCode.FORBIDDEN);
      await expect(userCollection.findOne({ email }))
        .resolves.toStrictEqual(expect.objectContaining({ verified: false }));
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('users');
  });

  afterAll(async () => {
    closeConnection();
  });
});
