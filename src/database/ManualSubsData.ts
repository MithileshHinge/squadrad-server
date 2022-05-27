/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { IManualSubsData } from '../manual-sub/IManualSubsData';
import ManualSubStatuses from '../manual-sub/ManualSubStatuses';
import BaseData from './BaseData';

export default class ManualSubsData extends BaseData implements IManualSubsData {
  async insertNewManualSub({
    manualSubId, userId, creatorUserId, squadId, amount, contactNumber, subscriptionStatus,
  }: {
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  }): Promise<{
      manualSubId: string,
      userId: string,
      creatorUserId: string,
      squadId: string,
      amount: number,
      contactNumber: string,
      subscriptionStatus: number,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('manualSubs').insertOne({
        _id: new ObjectId(manualSubId),
        userId,
        creatorUserId,
        squadId,
        amount,
        contactNumber,
        subscriptionStatus,
      });

      return {
        manualSubId: result.insertedId.toString(),
        userId,
        creatorUserId,
        squadId,
        amount,
        contactNumber,
        subscriptionStatus,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert Manual Sub');
    }
  }

  async fetchManualSubById(manualSubId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('manualSubs').findOne({ _id: new ObjectId(manualSubId) });
      if (!result) return null;

      return {
        manualSubId: result._id.toString(),
        userId: result.userId,
        creatorUserId: result.creatorUserId,
        squadId: result.squadId,
        amount: result.amount,
        contactNumber: result.contactNumber,
        subscriptionStatus: result.subscriptionStatus,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch manualSub by Id');
    }
  }

  async fetchManualSubByUserIds(userId: string, creatorUserId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('manualSubs').findOne({ userId, creatorUserId });
      if (!result) return null;

      return {
        manualSubId: result._id.toString(),
        userId: result.userId,
        creatorUserId: result.creatorUserId,
        squadId: result.squadId,
        amount: result.amount,
        contactNumber: result.contactNumber,
        subscriptionStatus: result.subscriptionStatus,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch manualSub by userIds');
    }
  }

  async fetchManualSubsByUserId(userId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('manualSubs').find({ userId }).toArray();
      if (result && result.length > 0) {
        return result.map((manualSub) => ({
          manualSubId: manualSub._id.toString(),
          userId: manualSub.userId,
          creatorUserId: manualSub.creatorUserId,
          squadId: manualSub.squadId,
          amount: manualSub.amount,
          contactNumber: manualSub.contactNumber,
          subscriptionStatus: manualSub.subscriptionStatus,
        }));
      }
      return [];
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch manualSubs by userId');
    }
  }

  async fetchManualSubsByCreatorUserId(creatorUserId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('manualSubs').find({ creatorUserId }).toArray();
      if (result && result.length > 0) {
        return result.map((manualSub) => ({
          manualSubId: manualSub._id.toString(),
          userId: manualSub.userId,
          creatorUserId: manualSub.creatorUserId,
          squadId: manualSub.squadId,
          amount: manualSub.amount,
          contactNumber: manualSub.contactNumber,
          subscriptionStatus: manualSub.subscriptionStatus,
        }));
      }
      return [];
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch manualSubs by creatorUserId');
    }
  }

  async countManualSubsByCreatorUserId(creatorUserId: string): Promise<Number> {
    const db = await this.getDb();
    try {
      const result = await db.collection('manualSubs').countDocuments({ creatorUserId, subscriptionStatus: ManualSubStatuses.ACTIVE });

      return result;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not count manual subs by creator userId');
    }
  }

  async sumAmountsByCreatorUserId(creatorUserId: string): Promise<Number> {
    const db = await this.getDb();
    try {
      const result = await db.collection('manualSubs').aggregate([
        { $match: { creatorUserId } },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
      ]).toArray();
      if (result && result.length > 0) return result[0].totalAmount;
      return 0;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not sum amounts by creator userId');
    }
  }
}
