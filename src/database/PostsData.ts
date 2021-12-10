import { ObjectId } from 'mongodb';
import { IPostsData } from '../post/IPostsData';
import BaseData from './BaseData';

export default class PostsData extends BaseData implements IPostsData {
  async insertNewPost({
    postId, userId, title, description,
  }: {
    postId: string,
    userId: string,
    title: string,
    description: string,
  }): Promise<{
      postId: string,
      userId: string,
      title: string,
      description: string,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('posts').insertOne({
        _id: new ObjectId(postId),
        userId,
        title,
        description,
      });
      return {
        postId: result.insertedId.toString(),
        userId,
        title,
        description,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new post');
    }
  }
}
