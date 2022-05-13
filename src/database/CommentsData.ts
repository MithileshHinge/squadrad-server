/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { ICommentsData } from '../comment/ICommentsData';
import BaseData from './BaseData';

export default class CommentsData extends BaseData implements ICommentsData {
  async insertNewComment({
    commentId, postId, userId, text, replyToCommentId,
  }: {
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }): Promise<{
      commentId: string,
      postId: string,
      userId: string,
      text: string,
      replyToCommentId?: string,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('comments').insertOne({
        _id: new ObjectId(commentId),
        postId,
        userId,
        text,
        replyToCommentId,
      });

      return {
        commentId: result.insertedId.toString(),
        postId,
        userId,
        text,
        replyToCommentId,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new comment');
    }
  }

  async fetchCommentById(commentId: string): Promise<{
    commentId: string
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('comments').findOne({ _id: new ObjectId(commentId) });
      if (!result) return null;
      return {
        commentId: result._id.toString(),
        postId: result.postId,
        userId: result.userId,
        text: result.text,
        replyToCommentId: result.replyToCommentId,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch comment by commentId');
    }
  }

  async fetchCommentsByPostId(postId: string): Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('comments').find({ postId }).toArray();
      if (!result || result.length <= 0) return [];
      return result.map((comment) => ({
        commentId: comment._id.toString(),
        postId: comment.postId,
        userId: comment.userId,
        text: comment.text,
        replyToCommentId: comment.replyToCommentId,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch comments by postId');
    }
  }

  async countCommentsByPostId(postId: string): Promise<Number> {
    const db = await this.getDb();
    try {
      const result = await db.collection('comments').countDocuments({ postId });
      return result;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not count comments by postId');
    }
  }
}
