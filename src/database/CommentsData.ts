/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { ICommentsData } from '../comment/ICommentsData';
import BaseData from './BaseData';

export default class CommentsData extends BaseData implements ICommentsData {
  async insertNewComment({
    commentId, postId, userId, text, replyToCommentId, timestamp,
  }: {
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
    timestamp: number,
  }): Promise<{
      commentId: string,
      postId: string,
      userId: string,
      text: string,
      replyToCommentId?: string,
      timestamp: number,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('comments').insertOne({
        _id: new ObjectId(commentId),
        postId,
        userId,
        text,
        replyToCommentId,
        timestamp,
      });

      return {
        commentId: result.insertedId.toString(),
        postId,
        userId,
        text,
        replyToCommentId,
        timestamp,
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
    timestamp: number,
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
        timestamp: result.timestamp,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch comment by commentId');
    }
  }

  async fetchCommentsByReplyToCommentId(replyToCommentId: string): Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId: string,
    timestamp: number,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('comments').find({ replyToCommentId }).toArray();
      if (result.length <= 0) return [];
      return result.map((reply) => ({
        commentId: reply._id.toString(),
        postId: reply.postId,
        userId: reply.userId,
        text: reply.text,
        replyToCommentId: reply.replyToCommentId,
        timestamp: reply.timestamp,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch comments by reply to commentId');
    }
  }

  async fetchCommentsByPostId(postId: string): Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
    timestamp: number,
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
        timestamp: comment.timestamp,
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

  async deleteCommentById(commentId: string): Promise<null> {
    const db = await this.getDb();
    try {
      await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not delete comment by Id');
    }
  }

  async deleteCommentsByPostId(postId: string): Promise<null> {
    const db = await this.getDb();
    try {
      await db.collection('comments').deleteMany({ postId });
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not delete comments by postId');
    }
  }
}
