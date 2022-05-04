/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId } from 'mongodb';
import { IPostLikesData } from '../post-like/IPostLikesData';
import BaseData from './BaseData';

export default class PostLikesData extends BaseData implements IPostLikesData {
  async insertNewLike({ postId, userId }: {
    postId: string,
    userId: string,
  }): Promise<number> {
    const db = await this.getDb();
    try {
      const result = await db.collection('postLikes').findOne({ _id: new ObjectId(postId) });
      if (result) {
        await db.collection('postLikes').updateOne({ _id: new ObjectId(postId) }, {
          $push: { users: userId },
        });
      } else {
        await db.collection('postLikes').insertOne({ _id: new ObjectId(postId), users: [userId] });
      }

      const count = await this.fetchLikesCount(postId);
      return count;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert a new like record');
    }
  }

  async fetchLike({ postId, userId }: {
    postId: string,
    userId: string,
  }): Promise<boolean> {
    const db = await this.getDb();
    try {
      const result = await db.collection('postLikes').findOne({ _id: new ObjectId(postId), users: userId });
      if (result) return true;
      return false;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch like record');
    }
  }

  async fetchLikesCount(postId: string): Promise<number> {
    const db = await this.getDb();
    try {
      // const result = await db.collection('postLikes').findOne({ _id: new ObjectId(postId) });
      const result = await db.collection('postLikes').aggregate([
        {
          $match: { _id: new ObjectId(postId) },
        }, {
          $project: { numLikes: { $size: '$users' } },
        },
      ]).toArray();
      if (result && result.length > 0) return result[0].numLikes;
      return 0;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch likes count');
    }
  }

  async deleteLike({ postId, userId }: {
    postId: string,
    userId: string
  }): Promise<number> {
    const db = await this.getDb();
    try {
      await db.collection('postLikes').updateOne({ _id: new ObjectId(postId) }, { $pull: { users: userId } });

      const count = await this.fetchLikesCount(postId);
      return count;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not delete like');
    }
  }
}
