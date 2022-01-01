/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { IPostsData } from '../post/IPostsData';
import { IPostAttachment } from '../post/IPostAttachment';
import BaseData from './BaseData';

export default class PostsData extends BaseData implements IPostsData {
  async insertNewPost({
    postId, userId, description, squadId, attachment,
  }: {
    postId: string,
    userId: string,
    // title: string,
    description: string,
    squadId: string,
    attachment?: IPostAttachment,
  }): Promise<{
      postId: string,
      userId: string,
      // title: string,
      description: string,
      squadId: string,
      attachment?: IPostAttachment,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('posts').insertOne({
        _id: new ObjectId(postId),
        userId,
        // title,
        description,
        squadId,
        attachment,
      });
      return {
        postId: result.insertedId.toString(),
        userId,
        // title,
        description,
        squadId,
        attachment,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new post');
    }
  }

  async fetchAllPostsByUserId(userId: string): Promise<{
    postId: string,
    userId: string,
    // title: string,
    description: string,
    squadId: string,
    attachment?: IPostAttachment,
  }[]> {
    const db = await this.getDb();
    try {
      const resultCur = db.collection('posts').find({ userId });
      const posts = await resultCur.toArray();
      return posts.map((post) => ({
        postId: post._id.toString(),
        userId: post.userId,
        description: post.description,
        squadId: post.squadId,
        attachment: post.attachment,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch posts by userId');
    }
  }
}
