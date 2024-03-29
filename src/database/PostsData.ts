/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { IPostsData } from '../post/IPostsData';
import { IPostAttachment } from '../post-attachment/IPostAttachment';
import BaseData from './BaseData';

export default class PostsData extends BaseData implements IPostsData {
  async insertNewPost({
    postId, userId, description, squadId, link, attachment, timestamp,
  }: {
    postId: string,
    userId: string,
    // title: string,
    description: string,
    squadId: string,
    link?: string,
    attachment?: IPostAttachment,
    timestamp: number,
  }): Promise<{
      postId: string,
      userId: string,
      // title: string,
      description: string,
      squadId: string,
      link?: string,
      attachment?: IPostAttachment,
      timestamp: number,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('posts').insertOne({
        _id: new ObjectId(postId),
        userId,
        // title,
        description,
        squadId,
        link,
        attachment,
        timestamp,
      });
      return {
        postId: result.insertedId.toString(),
        userId,
        // title,
        description,
        squadId,
        link,
        attachment,
        timestamp,
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
    link?: string,
    attachment?: IPostAttachment,
    timestamp: number,
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
        link: post.link,
        attachment: post.attachment,
        timestamp: post.timestamp,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch posts by userId');
    }
  }

  async fetchPostById(postId: string): Promise<{
    postId: string,
    userId: string,
    description: string,
    squadId: string,
    link?: string,
    attachment?: IPostAttachment,
    timestamp: number,
  } | null> {
    const db = await this.getDb();
    try {
      const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
      if (!post) return null;
      return {
        postId: post._id.toString(),
        userId: post.userId,
        description: post.description,
        squadId: post.squadId,
        link: post.link,
        attachment: post.attachment,
        timestamp: post.timestamp,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch post by postId');
    }
  }

  async updatePost({ postId, description }: {
    postId: string,
    description: string,
  }): Promise<null> {
    const db = await this.getDb();
    try {
      await db.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $set: { description } });
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not update post');
    }
  }

  async deletePost(postId: string): Promise<null> {
    const db = await this.getDb();
    try {
      await db.collection('posts').deleteOne({ _id: new ObjectId(postId) });
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not delete post');
    }
  }
}
