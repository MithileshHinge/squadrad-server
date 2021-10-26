import request from 'supertest';
import { Collection, Document, ObjectId } from 'mongodb';
import app from '../../api/server';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import { getLoggedInUser } from '../__mocks__/user/users';
import sampleCreatorParams from '../__mocks__/creator/creatorParams';
import { HTTPResponseCode } from '../../api/HttpResponse';
import { closeMockStoreConnection } from '../__mocks__/api/mockStore';
import { getLoggedInCreator } from '../__mocks__/creator/creators';
import faker from '../__mocks__/faker';

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
});
