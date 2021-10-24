/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import BaseData from './BaseData';
import { ICreatorsData } from '../creator/ICreatorsData';

export default class CreatorsData extends BaseData implements ICreatorsData {
  async insertNewCreator({
    userId, pageName, bio, isPlural, showTotalSquadMembers, about,
  }: {
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
  }): Promise<{ userId: string; pageName: string; bio: string; isPlural: boolean; showTotalSquadMembers: boolean; about: string; }> {
    const db = await this.getDb();
    try {
      await db.collection('creators').insertOne({
        _id: new ObjectId(userId),
        pageName,
        bio,
        isPlural,
        showTotalSquadMembers,
        about,
      });
      return {
        userId,
        pageName,
        bio,
        isPlural,
        showTotalSquadMembers,
        about,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new creator into database');
    }
  }

  async fetchCreatorById(userId: string): Promise<{ userId: string, pageName: string, bio: string, isPlural: boolean, showTotalSquadMembers: boolean, about: string } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('creators').findOne({ _id: new ObjectId(userId) });
      if (!result) return null;
      return {
        userId: result._id.toString(),
        pageName: result.pageName,
        bio: result.bio,
        isPlural: result.isPlural,
        showTotalSquadMembers: result.showTotalSquadMembers,
        about: result.about,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch creator');
    }
  }

  async updateCreator({ userId, ...updateData }: {
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
    showTotalSquadMembers?: boolean,
    about?: string,
  }): Promise<{ userId: string, pageName?: string, bio?: string, isPlural?: boolean, showTotalSquadMembers?: boolean, about?: string }> {
    const db = await this.getDb();
    try {
      await db.collection('creators').updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
      return {
        userId,
        ...updateData,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not update creator');
    }
  }
}
