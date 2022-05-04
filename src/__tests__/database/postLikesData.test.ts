import { Collection, Document, ObjectId } from 'mongodb';
import id from '../../common/id';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import PostLikesData from '../../database/PostLikesData';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import faker from '../__mocks__/faker';

describe('Post likes data access gateway', () => {
  const postLikesData = new PostLikesData(mockDb, handleDatabaseError);
  let postLikesCollection: Collection<Document>;

  beforeEach(async () => {
    postLikesCollection = await (await mockDb()).createCollection('postLikes');

    // insert fake data
    const postId = id.createId();
    const userIdArr: string[] = [];
    for (let i = 0; i < faker.datatype.number({ min: 1, max: 10, precision: 1 }); i += 1) {
      userIdArr.push(id.createId());
    }
    postLikesCollection.insertOne({
      _id: new ObjectId(postId),
      users: userIdArr,
    });
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('postLikes');
  });

  afterAll(async () => {
    closeConnection();
  });

  describe('insertNewLike', () => {
    it('Can insert first new like on a post, and returns correct likes count = 1', async () => {
      const postId = id.createId();
      const userId = id.createId();
      await expect(postLikesData.insertNewLike({ postId, userId })).resolves.toBe(1);
      await expect(postLikesCollection.findOne({ _id: new ObjectId(postId), users: userId })).resolves.toStrictEqual(expect.objectContaining({ users: [userId] }));
    });

    it('Can insert nth new like on post, and returns correct likes count', async () => {
      const postId = id.createId();
      const userId = id.createId();
      const userIdArr: string[] = [];
      for (let i = 0; i < faker.datatype.number({ min: 1, max: 10, precision: 1 }); i += 1) {
        userIdArr.push(id.createId());
      }
      postLikesCollection.insertOne({
        _id: new ObjectId(postId),
        users: userIdArr,
      });

      await expect(postLikesData.insertNewLike({ postId, userId })).resolves.toBe(userIdArr.length + 1);
      await expect(postLikesCollection.findOne({ _id: new ObjectId(postId), users: userId })).resolves.toStrictEqual(expect.objectContaining({ users: [...userIdArr, userId] }));
    });
  });

  describe('fetchLike', () => {
    it('Returns true if like record exists', async () => {
      const postId = id.createId();
      const userId = id.createId();
      postLikesCollection.insertOne({
        _id: new ObjectId(postId),
        users: [userId],
      });

      await expect(postLikesData.fetchLike({ postId, userId })).resolves.toBe(true);
    });

    it('Returns false if post record does not exist', async () => {
      const postId = id.createId();
      const userId = id.createId();

      postLikesCollection.insertOne({
        _id: new ObjectId(postId),
      });

      await expect(postLikesData.fetchLike({ postId, userId })).resolves.toBe(false);
    });

    it('Returns false if like record does not exist on post', async () => {
      const postId = id.createId();
      const userId = id.createId();

      await expect(postLikesData.fetchLike({ postId, userId })).resolves.toBe(false);
    });
  });

  describe('fetchLikesCount', () => {
    it('Returns the correct likes count', async () => {
      const postId = id.createId();

      const userIdArr: string[] = [];
      for (let i = 0; i < faker.datatype.number({ min: 1, max: 10, precision: 1 }); i += 1) {
        userIdArr.push(id.createId());
      }
      postLikesCollection.insertOne({
        _id: new ObjectId(postId),
        users: userIdArr,
      });

      await expect(postLikesData.fetchLikesCount(postId)).resolves.toBe(userIdArr.length);
    });

    it('Returns 0 if post record does not exist', async () => {
      const postId = id.createId();
      await expect(postLikesData.fetchLikesCount(postId)).resolves.toBe(0);
    });
  });

  describe('deleteLike', () => {
    it('Can delete first like on a post, and return correct likes count = 0', async () => {
      const postId = id.createId();
      const userId = id.createId();
      postLikesCollection.insertOne({
        _id: new ObjectId(postId),
        users: [userId],
      });

      await expect(postLikesData.deleteLike({ postId, userId })).resolves.toBe(0);
      await expect(postLikesCollection.findOne({ _id: new ObjectId(postId), users: userId })).resolves.toBeNull();
    });

    it('Can delete nth like on a post, and return correct likes count', async () => {
      const postId = id.createId();

      const userIdArr: string[] = [];
      for (let i = 0; i < faker.datatype.number({ min: 1, max: 10, precision: 1 }); i += 1) {
        userIdArr.push(id.createId());
      }
      postLikesCollection.insertOne({
        _id: new ObjectId(postId),
        users: userIdArr,
      });

      await expect(postLikesData.deleteLike({ postId, userId: userIdArr[0] })).resolves.toBe(userIdArr.length - 1);
      await expect(postLikesCollection.findOne({ _id: new ObjectId(postId), users: userIdArr[0] })).resolves.toBeNull();
    });
  });
});
