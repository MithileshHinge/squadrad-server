import { Collection, Document, ObjectId } from 'mongodb';
import id from '../../common/id';
import handleDatabaseError from '../../database/DatabaseErrorHandler';
import PostsData from '../../database/PostsData';
import mockDb, { closeConnection } from '../__mocks__/database/mockDb';
import faker from '../__mocks__/faker';
import newPostAttachment from '../__mocks__/post-attachment/postAttachments';
import newPost from '../__mocks__/post/posts';

describe('Posts data access gateway', () => {
  const postsData = new PostsData(mockDb, handleDatabaseError);
  let postsCollection: Collection<Document>;

  beforeEach(async () => {
    postsCollection = await (await mockDb()).createCollection('posts');
  });

  afterEach(async () => {
    await (await mockDb()).dropCollection('posts');
  });

  afterAll(async () => {
    closeConnection();
  });

  describe('insertNewPost', () => {
    it('Can insert new post with attachment', async () => {
      const postId = id.createId();
      const attachment = await newPostAttachment();
      const post = newPost(postId, attachment);
      await expect(postsData.insertNewPost(post)).resolves.not.toThrowError();
      await expect(postsCollection.findOne({ _id: new ObjectId(post.postId) })).resolves.toBeTruthy();
    });

    it('Can insert new post with link', async () => {
      const postId = id.createId();
      const link = await faker.internet.url();
      const post = newPost(postId, undefined, link);
      await expect(postsData.insertNewPost(post)).resolves.not.toThrowError();
      await expect(postsCollection.findOne({ _id: new ObjectId(post.postId), link })).resolves.toBeTruthy();
    });
  });
});
