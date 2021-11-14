/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { ISquadsData } from '../squad/ISquadsData';
import BaseData from './BaseData';

export default class SquadsData extends BaseData implements ISquadsData {
  async insertNewSquad({
    squadId, userId, title, amount, description, membersLimit,
  }: {
    squadId: string,
    userId: string,
    title: string,
    amount: number,
    description?: string,
    membersLimit?: number,
  }): Promise<{
      squadId: string,
      userId: string,
      title: string,
      amount: number,
      description?: string,
      membersLimit?: number,
    }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('squads').insertOne({
        _id: new ObjectId(squadId),
        userId,
        title,
        amount,
        description,
        membersLimit,
      });
      return {
        squadId: result.insertedId.toString(),
        userId,
        title,
        amount,
        description,
        membersLimit,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new squad');
    }
  }

  async fetchSquadByAmount({ userId, amount }: {
    userId: string,
    amount: number,
  }): Promise<{
      userId: string,
      squadId: string,
      title: string,
      amount: number,
      description?: string,
      membersLimit?: number,
    } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('squads').findOne({ userId, amount });
      if (!result) return null;
      return {
        squadId: result._id.toString(),
        userId: result.userId,
        title: result.title,
        amount: result.amount,
        description: result.description,
        membersLimit: result.membersLimit,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch squad');
    }
  }

  async updateSquad({ squadId, ...updateData }: {
    squadId: string,
    title?: string,
    description?: string,
    membersLimit?: number,
  }): Promise<{
      squadId: string,
      title?: string,
      description?: string,
      membersLimit?: number,
    }> {
    const db = await this.getDb();
    try {
      await db.collection('squads').updateOne({ _id: new ObjectId(squadId) }, { $set: updateData });
      return {
        squadId,
        ...updateData,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not update squad');
    }
  }
}
