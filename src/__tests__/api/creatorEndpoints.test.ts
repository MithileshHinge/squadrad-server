import request from 'supertest';
import fs from 'fs-extra';
import { Collection, Document, ObjectId } from 'mongodb';
import app from '../../api/server';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import { getLoggedInUser } from '../__mocks__/user/users';
import sampleCreatorParams from '../__mocks__/creator/creatorParams';
import { HTTPResponseCode } from '../../api/HttpResponse';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';
import fileValidator from '../../common/validators/fileValidator';

describe('Creator Endpoints', () => {
  let userCollection: Collection<Document>;
  let creatorCollection: Collection<Document>;

  beforeEach(async () => {
    userCollection = await (await mockDb()).createCollection('users');
    creatorCollection = await (await mockDb()).createCollection('creators');
  });

  afterEach(async () => {
    await userCollection.drop();
    await creatorCollection.drop();
    fs.emptyDir('public/images/profilePics/creators/test');
  });

  afterAll(async () => {
    await closeConnection();
    await closeMockStoreConnection();
  });

  describe('POST /creator', () => {
    it('Can become a creator', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      await agent.post('/creator').send({ userId, ...sampleCreatorParams }).expect(HTTPResponseCode.OK);
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toBeTruthy();
    });

    it('Respond with error code 400 (Bad Request) if parameters are invalid', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      const badParams = {
        pageName: '4f4 f4   f24f2',
        bio: 'nfoi322n3d',
      };
      await Promise.all(Object.entries(badParams).map(async ([param, value]) => {
        await agent.post('/creator').send({ userId, ...sampleCreatorParams, [param]: value }).expect(HTTPResponseCode.BAD_REQUEST);
        await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toBeNull();
      }));
    });
  });

  describe('PATCH /creator', () => {
    it('Can edit creator', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const {
        pageName: pageNamePrev,
        bio: bioPrev,
        isPlural: isPluralPrev,
        showTotalSquadMembers: showTotalSquadMembersPrev,
        about: aboutPrev,
      } = (await creatorCollection.findOne({ _id: new ObjectId(userId) }))!;
      const pageName = faker.name.findName();
      const bio = faker.lorem.word(5);
      const isPlural = !isPluralPrev;
      const showTotalSquadMembers = !showTotalSquadMembersPrev;
      const about = faker.lorem.paragraph();
      await agent.patch('/creator').send({
        userId, pageName, bio, isPlural, showTotalSquadMembers, about,
      }).expect(HTTPResponseCode.OK);
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.not.toStrictEqual(expect.objectContaining({
        pageName: pageNamePrev, bio: bioPrev, isPlural: isPluralPrev, showTotalSquadMembers: showTotalSquadMembersPrev, about: aboutPrev,
      }));
    });

    it('Cannot edit if user is not a creator', async () => {
      const { agent, userId } = await getLoggedInUser(app, userCollection);
      const pageName = faker.name.findName();
      const bio = faker.lorem.word(5);
      const isPlural = true;
      const showTotalSquadMembers = true;
      const about = faker.lorem.paragraph();
      await agent.patch('/creator').send({
        userId, pageName, bio, isPlural, showTotalSquadMembers, about,
      }).expect(HTTPResponseCode.FORBIDDEN);
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(null);
    });

    it('Respond with error code 400 (Bad Request) if parameters are invalid', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const {
        pageName: pageNamePrev, bio: bioPrev, isPlural, showTotalSquadMembers, about: aboutPrev,
      } = (await creatorCollection.findOne({ _id: new ObjectId(userId) }))!;
      const prevParams = {
        pageName: pageNamePrev, bio: bioPrev, isPlural, showTotalSquadMembers, about: aboutPrev,
      };
      const badParams = {
        pageName: '4f4 f4   f24f2',
        bio: 'nfoi322n3d',
        about: 42341234234,
      };
      await Promise.all(Object.entries(badParams).map(async ([param, value]) => {
        await agent.patch('/creator').send({
          userId, ...prevParams, [param]: value,
        }).expect(HTTPResponseCode.BAD_REQUEST);
        await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining(prevParams));
      }));
    });
  });

  describe('PUT /creator/profile-pic', () => {
    it('Can add new profile pic', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const { body: { profilePicSrc: dest } } = await agent.put('/creator/profile-pic').attach('profilePic', 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg').expect(HTTPResponseCode.OK);
      expect(fileValidator.fileExists(`public/images/profilePics/creators/${dest}`)).toBeTruthy();
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining({ profilePicSrc: expect.stringContaining(`test/${userId}/`) }));
    });

    it('Can change profile pic', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const { body: { profilePicSrc: dest1 } } = await agent.put('/creator/profile-pic').attach('profilePic', 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg').expect(HTTPResponseCode.OK);
      expect(fileValidator.fileExists(`public/images/profilePics/creators/${dest1}`)).toBeTruthy();
      const { body: { profilePicSrc: dest2 } } = await agent.put('/creator/profile-pic').attach('profilePic', 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg').expect(HTTPResponseCode.OK);
      expect(fileValidator.fileExists(`public/images/profilePics/creators/${dest1}`)).toBeFalsy();
      expect(fileValidator.fileExists(`public/images/profilePics/creators/${dest2}`)).toBeTruthy();
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining({ profilePicSrc: expect.stringContaining(`test/${userId}/`) }));
    });

    it('Respond with error code 400 (Bad Request) if no file is provided', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const { profilePicSrc } = (await creatorCollection.findOne({ _id: new ObjectId(userId) }))!;
      await agent.put('/creator/profile-pic').attach('profilePic', '').expect(HTTPResponseCode.BAD_REQUEST);
      expect(fs.readdirSync('public/images/profilePics/creators/test')).toEqual([]);
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining({ profilePicSrc }));
      await agent.put('/creator/profile-pic').expect(HTTPResponseCode.BAD_REQUEST);
      expect(fs.readdirSync('public/images/profilePics/creators/test')).toEqual([]);
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining({ profilePicSrc }));
    });

    it('Respond with error code 400 (Bad Request) if image is not JPG', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const { profilePicSrc } = (await creatorCollection.findOne({ _id: new ObjectId(userId) }))!;
      await agent.put('/creator/profile-pic').attach('profilePic', 'src/__tests__/__mocks__/profile-pic/sample-invalid-pic.png').expect(HTTPResponseCode.BAD_REQUEST);
      expect(fs.readdirSync('public/images/profilePics/creators/test')).toEqual([]);
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining({ profilePicSrc }));
    });

    it('Respond with error code 400 (Bad Request) if image is false JPG', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const { profilePicSrc } = (await creatorCollection.findOne({ _id: new ObjectId(userId) }))!;
      await agent.put('/creator/profile-pic').attach('profilePic', 'src/__tests__/__mocks__/profile-pic/sample-invalid-pic.jpg').expect(HTTPResponseCode.BAD_REQUEST);
      expect(fs.readdirSync('public/images/profilePics/creators/test')).toEqual([]);
      await expect(creatorCollection.findOne({ _id: new ObjectId(userId) })).resolves.toStrictEqual(expect.objectContaining({ profilePicSrc }));
    });
  });

  describe('GET /creator', () => {
    it('Can get self creator page', async () => {
      const { agent, userId } = await getLoggedInCreator(app, userCollection);
      const res = await agent.get('/creator').expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ userId }));
    });

    it('Respond with error code 404 (Not found) if user is not a creator', async () => {
      const { agent } = await getLoggedInUser(app, userCollection);
      await agent.get('/creator').expect(HTTPResponseCode.NOT_FOUND);
    });

    it('Respond with error code 401 (Unauthorized) if not logged in', async () => {
      await request(app).get('/creator').expect(HTTPResponseCode.UNAUTHORIZED);
    });
  });

  describe('GET /creator/:userId', () => {
    it('Can get a creator by userId', async () => {
      const { userId } = await getLoggedInCreator(app, userCollection);
      const res = await request(app).get(`/creator/${userId}`).expect(HTTPResponseCode.OK);
      expect(res.body).toStrictEqual(expect.objectContaining({ userId }));
    });

    it('Respond with error code 404 (Not found) if user is not a creator', async () => {
      const { userId } = await getLoggedInUser(app, userCollection);
      await request(app).get(`/creator/${userId}`).expect(HTTPResponseCode.NOT_FOUND);
    });

    it('Respond with error code 400 (Bad request) if userId is invalid', async () => {
      const userId = '3nro3ro32emo3e';
      await request(app).get(`/creator/${userId}`).expect(HTTPResponseCode.BAD_REQUEST);
    });
  });
});
