/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import BaseData from './BaseData';
import { ICreatorsData } from '../creator/ICreatorsData';
import ReviewPageStatus from '../creator/ReviewPageStatus';

export default class CreatorsData extends BaseData implements ICreatorsData {
  async insertNewCreator({
    userId, pageName, bio, isPlural, showTotalSquadMembers, about, goalsTypeEarnings, review,
  }: {
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
    goalsTypeEarnings: boolean,
    review: { status: ReviewPageStatus, rejectionReason?: string },
  }): Promise<{ userId: string; pageName: string; bio: string; isPlural: boolean; showTotalSquadMembers: boolean; about: string; goalsTypeEarnings: boolean, review: { status: ReviewPageStatus, rejectionReason?: string } }> {
    const db = await this.getDb();
    try {
      await db.collection('creators').insertOne({
        _id: new ObjectId(userId),
        pageName,
        bio,
        isPlural,
        showTotalSquadMembers,
        about,
        goalsTypeEarnings,
        review,
      });
      return {
        userId,
        pageName,
        bio,
        isPlural,
        showTotalSquadMembers,
        about,
        goalsTypeEarnings,
        review,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new creator into database');
    }
  }

  async fetchCreatorById(userId: string): Promise<{ userId: string, pageName: string, bio: string, isPlural: boolean, showTotalSquadMembers: boolean, about: string, goalsTypeEarnings: boolean, profilePicSrc: string, review: { status: ReviewPageStatus, rejectionReason?: string } } | null> {
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
        goalsTypeEarnings: result.goalsTypeEarnings,
        profilePicSrc: result.profilePicSrc,
        review: result.review,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch creator');
    }
  }

  async fetchAllCreatorsByIds(userIds: string[]): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
    goalsTypeEarnings: boolean,
    profilePicSrc: string,
    review: { status: ReviewPageStatus, rejectionReason?: string },
  }[]> {
    const db = await this.getDb();
    try {
      const userObjectIds = userIds.map((userId) => new ObjectId(userId));
      const result = await db.collection('creators').find({ _id: { $in: userObjectIds } }).toArray();

      return result.map((doc) => ({
        userId: doc._id.toString(),
        pageName: doc.pageName,
        bio: doc.bio,
        isPlural: doc.isPlural,
        showTotalSquadMembers: doc.showTotalSquadMembers,
        about: doc.about,
        goalsTypeEarnings: doc.goalsTypeEarnings,
        profilePicSrc: doc.profilePicSrc,
        review: doc.review,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch all creators by userIds');
    }
  }

  async fetchAllCreators(): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
    goalsTypeEarnings: boolean,
    profilePicSrc: string,
    review: { status: ReviewPageStatus, rejectionReason?: string },
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('creators').find({}).toArray();

      return result.map((doc) => ({
        userId: doc._id.toString(),
        pageName: doc.pageName,
        bio: doc.bio,
        isPlural: doc.isPlural,
        showTotalSquadMembers: doc.showTotalSquadMembers,
        about: doc.about,
        goalsTypeEarnings: doc.goalsTypeEarnings,
        profilePicSrc: doc.profilePicSrc,
        review: doc.review,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch all creators');
    }
  }

  async updateCreator({ userId, ...updateData }: {
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
    showTotalSquadMembers?: boolean,
    about?: string,
    goalsTypeEarnings?: boolean,
    review: { status: ReviewPageStatus, rejectionReason?: string },
  }): Promise<{ userId: string, pageName?: string, bio?: string, isPlural?: boolean, showTotalSquadMembers?: boolean, about?: string, goalsTypeEarnings?: boolean, review: { status: ReviewPageStatus, rejectionReason?: string } }> {
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
