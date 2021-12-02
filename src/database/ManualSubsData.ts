import { ObjectId } from 'mongodb';
import { IManualSubsData } from '../manual-sub/IManualSubsData';
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
}
