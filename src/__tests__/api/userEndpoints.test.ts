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
import { newUser } from '../__mocks__/user/users';

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
    userCollection = await (await mockDb()).createCollection('users');
  });

  describe('POST /user', () => {
    it('Can add new user', async () => {
      await request(app).post('/user').send(sampleUserParams).expect(HTTPResponseCode.CREATED);
      await expect(userCollection.findOne({ email: sampleUserParams.email }))
        .resolves.toStrictEqual(expect.objectContaining({ email: sampleUserParams.email }));
    });

    it('Respond with error code 400 (Bad Request) if user with email already exists', async () => {
      const { userId, ...userInfo } = newUser();
      userCollection.insertOne({
        _id: new ObjectId(userId),
        ...userInfo,
      });
      await request(app).post('/user').send({ ...sampleUserParams, email: userInfo.email }).expect(HTTPResponseCode.BAD_REQUEST);
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
      const { userId, ...userInfo } = newUser();
      userCollection.insertOne({
        _id: new ObjectId(userId),
        ...userInfo,
        verified: false,
      });
      const token = issueJWT({ email: userInfo.email }, 100);
      await request(app).patch('/user/verify').send({ token }).expect(HTTPResponseCode.OK);
      await expect(userCollection.findOne({ email: userInfo.email }))
        .resolves.toStrictEqual(expect.objectContaining({ verified: true }));
    });

    it('Respond with error code 400 (Bad Request) if email id does not exist', async () => {
      const email = faker.internet.email();
      const token = issueJWT({ email }, 100);
      await request(app).patch('/user/verify').send({ token }).expect(HTTPResponseCode.BAD_REQUEST);
    });

    it('Respond with error code 403 (Forbidden) if token is expired', async () => {
      const { userId, ...userInfo } = newUser();
      userCollection.insertOne({
        _id: new ObjectId(userId),
        ...userInfo,
        verified: false,
      });
      const token = issueJWT({ email: userInfo.email }, 2);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 3000);
      });
      await request(app).patch('/user/verify').send({ token }).expect(HTTPResponseCode.FORBIDDEN);
      await expect(userCollection.findOne({ email: userInfo.email }))
        .resolves.toStrictEqual(expect.objectContaining({ verified: false }));
    });
  });

  describe('POST /user/login', () => {
    it('Can login user', async () => {
      const { userId, email, password } = await getRegisteredUser({ verified: true });
      const agent = request.agent(app);

      const res = await agent.post('/user/login').send({ email, password }).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ userId }));

      // check if session cookie is set
      const setCookieHeader: Array<string> = res.headers['set-cookie'];
      const sessionCookie = setCookieHeader.find((c) => c.includes('sessionId'));
      expect(sessionCookie).toContain('HttpOnly');
      expect(sessionCookie).toContain('SameSite=Strict');
      expect(sessionCookie).not.toContain('Max-Age');
      expect(sessionCookie).not.toContain('Expires');

      const resget = await agent.get('/user').set('Accept', 'application/json').expect(HTTPResponseCode.OK);
      expect(resget.body).toStrictEqual(expect.objectContaining({ userId, email }));
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

  describe('GET /user', () => {
    it('Can get user self info', async () => {
      const { agent, userId, email } = await getLoggedInUser();
      const res = await agent.get('/user').set('Accept', 'application/json').expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ userId, email }));
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      await request(app).get('/user').set('Accept', 'application/json').expect(HTTPResponseCode.UNAUTHORIZED);
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

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      await request(app).patch('/user').send({}).expect(HTTPResponseCode.UNAUTHORIZED);
    });
  });

  describe('PATCH /user/password', () => {
    it('Can change password', async () => {
      const { agent, userId, password: oldPassword } = await getLoggedInUser();
      const newPassword = faker.internet.password();
      await agent.patch('/user/password').send({ oldPassword, newPassword }).expect(HTTPResponseCode.OK);
      const { password: passwordHash } = (await userCollection.findOne({
        _id: new ObjectId(userId),
      }))!;
      expect(passwordEncryption.compare(newPassword, passwordHash)).toBeTruthy();
    });

    it('Respond with error code 401 (Unauthorized) if oldPassword is incorrect or not provided', async () => {
      const { agent, userId, password: oldPassword } = await getLoggedInUser();
      const incorrectPassword = 'random incorrect password';
      const newPassword = faker.internet.password();
      await agent.patch('/user/password').send({ oldPassword: incorrectPassword, newPassword }).expect(HTTPResponseCode.UNAUTHORIZED);
      const { password: passwordHash } = (await userCollection.findOne({
        _id: new ObjectId(userId),
      }))!;
      expect(passwordEncryption.compare(oldPassword, passwordHash)).toBeTruthy();
    });

    it('Respond with error code 400 (Bad Request) if newPassword is not valid', async () => {
      const { agent, userId, password: oldPassword } = await getLoggedInUser();
      const newPassword = 'asd';
      await agent.patch('/user/password').send({ oldPassword, newPassword }).expect(HTTPResponseCode.BAD_REQUEST);
      const { password: passwordHash } = (await userCollection.findOne({
        _id: new ObjectId(userId),
      }))!;
      expect(passwordEncryption.compare(oldPassword, passwordHash)).toBeTruthy();
    });

    it('Respond with error code 401 (Unauthorized) if user is not logged in', async () => {
      await request(app).patch('/user/password').send({}).expect(HTTPResponseCode.UNAUTHORIZED);
    });
  });

  describe('POST /user/logout', () => {
    it('Can log out user', async () => {
      const { agent } = await getLoggedInUser();

      await agent.post('/user/logout').send({}).expect(HTTPResponseCode.OK);
      await agent.get('/user').set('Accept', 'application/json').expect(HTTPResponseCode.UNAUTHORIZED);
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
