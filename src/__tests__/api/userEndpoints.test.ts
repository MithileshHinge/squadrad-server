/* eslint-disable no-underscore-dangle */
import { Collection, Document, ObjectId } from 'mongodb';
import request, { SuperAgentTest } from 'supertest';
import { HTTPResponseCode } from '../../api/HttpResponse';
import app from '../../api/server';
import { issueJWT } from '../../common/jwt';
import passwordEncryption from '../../user/password';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import faker from '../__mocks__/faker';

import sampleUserParams from '../__mocks__/user/userParams';
import sampleUsers, { newUser } from '../__mocks__/user/users';

describe('User Endpoints', () => {
  let userCollection: Collection<Document>;

  async function getRegisteredUser({ verified }: { verified: boolean }): Promise<{
    userId: string, email: string, password: string,
  }> {
    // insert new verified user for testing
    const {
      userId: tempUserId,
      password: tempPassword,
      verified: tempVerified,
      ...tempUser
    } = newUser();

    const userId = tempUserId;
    const password = faker.internet.password();
    await userCollection.insertOne({
      _id: new ObjectId(userId),
      password: passwordEncryption.encrypt(password),
      verified,
      ...tempUser,
    });

    return {
      userId,
      email: tempUser.email,
      password,
    };
  }

  async function getLoggedInUser(): Promise<{
    agent: SuperAgentTest, userId: string, email: string, password: string,
  }> {
    const agent = request.agent(app);

    const { userId, email, password } = await getRegisteredUser({ verified: true });

    // log in user
    await agent.post('/user/login').send({ email, password }).expect(HTTPResponseCode.OK);

    return {
      agent,
      userId,
      email,
      password,
    };
  }

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

    it('Respond with error code 400 (Bad Request) if user with email already exists', async () => {
      // get existing user
      const { email } = sampleUsers[0];
      await request(app).post('/user').send({ ...sampleUserParams, email }).expect(HTTPResponseCode.BAD_REQUEST);
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

  describe('POST /user/login', () => {
    it('Can login user', async () => {
      const { userId, email, password } = await getRegisteredUser({ verified: true });

      const res = await request(app).post('/user/login').send({ email, password }).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ userId }));

      // check if session cookie is set
      const setCookieHeader: Array<string> = res.headers['set-cookie'];
      const sessionCookie = setCookieHeader.find((c) => c.includes('sessionId'));
      expect(sessionCookie).toContain('HttpOnly');
      expect(sessionCookie).toContain('SameSite=Strict');
      expect(sessionCookie).not.toContain('Max-Age');
      expect(sessionCookie).not.toContain('Expires');
    });

    it('Respond with error code 401 (Unauthorized) if incorrect email or password provided', async () => {
      const { email, password } = await getRegisteredUser({ verified: true });

      await request(app).post('/user/login').send({ email, password: 'randomincorrectpassword' }).expect(HTTPResponseCode.UNAUTHORIZED);
      await request(app).post('/user/login').send({ email: 'randomincorrectemail@gmail.com', password }).expect(HTTPResponseCode.UNAUTHORIZED);
    });

    it('Respond with error code 403 (Forbidden) if user\'s email address is not verified', async () => {
      const { email, password } = await getRegisteredUser({ verified: false });
      await request(app).post('/user/login').send({ email, password }).expect(HTTPResponseCode.FORBIDDEN);
    });
  });

  describe('PATCH /user', () => {
    describe('Change fullname', () => {
      it('Can change self fullname', async () => {
        const { agent, userId } = await getLoggedInUser();
        const newFullName = faker.name.findName();
        await agent.patch('/user').send({ fullName: newFullName }).expect(HTTPResponseCode.OK);
        await expect(userCollection.findOne({ _id: new ObjectId(userId) }))
          .resolves.toStrictEqual(expect.objectContaining({ fullName: newFullName }));
      });

      it('Respond with error code 400 (Bad Request) if fullname is invalid', async () => {
        const { agent, userId } = await getLoggedInUser();
        const newFullName = '3nir3no2 a a grg   sfdsdv23r';
        await agent.patch('/user').send({ fullName: newFullName }).expect(HTTPResponseCode.BAD_REQUEST);
        await expect(userCollection.findOne({ _id: new ObjectId(userId) }))
          .resolves.not.toStrictEqual(expect.objectContaining({ fullName: newFullName }));
      });
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('users');
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });
});
