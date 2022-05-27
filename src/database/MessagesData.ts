/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import IMessagesData from '../message/IMessagesData';
import BaseData from './BaseData';

export default class MessagesData extends BaseData implements IMessagesData {
  async insertNewMessage({
    messageId, senderUserId, receiverUserId, text, isSenderCreator, timestamp,
  }: {
    messageId: string,
    senderUserId: string,
    receiverUserId: string,
    text: string,
    isSenderCreator: boolean,
    timestamp: number,
  }): Promise<{
      messageId: string,
      senderUserId: string,
      receiverUserId: string,
      text: string,
      isSenderCreator: boolean,
      timestamp: number,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('messages').insertOne({
        _id: new ObjectId(messageId),
        userId: isSenderCreator ? receiverUserId : senderUserId,
        creatorUserId: isSenderCreator ? senderUserId : receiverUserId,
        text,
        isSenderCreator,
        timestamp,
      });

      return {
        messageId: result.insertedId.toString(),
        senderUserId,
        receiverUserId,
        text,
        isSenderCreator,
        timestamp,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not add message');
    }
  }

  async fetchMessagesByUserIds({
    userId, creatorUserId,
  }: {
    userId: string,
    creatorUserId: string,
  }): Promise<{
      messageId: string,
      senderUserId: string,
      receiverUserId: string,
      text: string,
      isSenderCreator: boolean,
      timestamp: number,
    }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('messages').find({ userId, creatorUserId }).toArray();

      return result.map((message) => ({
        messageId: message._id.toString(),
        senderUserId: message.isSenderCreator ? message.creatorUserId : message.userId,
        receiverUserId: message.isSenderCreator ? message.userId : message.creatorUserId,
        text: message.text,
        isSenderCreator: message.isSenderCreator,
        timestamp: message.timestamp,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch messages by userId');
    }
  }

  async fetchLastMessages({ userId, isFromCreatorInbox }: {
    userId: string, isFromCreatorInbox: boolean,
  }): Promise<{
      messageId: string,
      senderUserId: string,
      receiverUserId: string,
      text: string,
      isSenderCreator: boolean,
      timestamp: number,
    }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('messages').aggregate([{
        $match: { [isFromCreatorInbox ? 'creatorUserId' : 'userId']: userId },
      }, {
        $sort: {
          timestamp: -1,
        },
      }, {
        $group: {
          _id: isFromCreatorInbox ? '$userId' : '$creatorUserId',
          messageId: { $first: '$_id' },
          userId: { $first: '$userId' },
          creatorUserId: { $first: '$creatorUserId' },
          text: { $first: '$text' },
          isSenderCreator: { $first: '$isSenderCreator' },
          timestamp: { $first: '$timestamp' },
        },
      }]).toArray();

      return result.map((lastMessage) => ({
        messageId: lastMessage.messageId,
        senderUserId: lastMessage.isSenderCreator ? lastMessage.creatorUserId : lastMessage.userId,
        receiverUserId: lastMessage.isSenderCreator ? lastMessage.userId : lastMessage.creatorUserId,
        text: lastMessage.text,
        isSenderCreator: lastMessage.isSenderCreator,
        timestamp: lastMessage.timestamp,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch last messages');
    }
  }
}
