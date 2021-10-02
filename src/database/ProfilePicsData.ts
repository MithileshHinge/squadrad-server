import { ObjectId } from 'mongodb';
import { IProfilePicsData } from '../profile-pic/IProfilePicsData';
import BaseData from './BaseData';

export default class ProfilePicsData extends BaseData implements IProfilePicsData {
  async updateProfilePic(userId: string, profilePicSrc: string): Promise<void> {
    const db = await this.getDb();
    try {
      await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { profilePicSrc } });
    } catch (err) {
      this.handleDatabaseError(err, 'Could not update profile picture');
    }
  }

  async fetchProfilePic(userId: string): Promise<string | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!result) return null;
      return result.profilePicSrc;
    } catch (err) {
      return this.handleDatabaseError(err, 'Could not fetch profile picture');
    }
  }
}
