import { Collection, Document, ObjectId } from 'mongodb';
import { IProfilePicsData } from '../profile-pic/IProfilePicsData';
import BaseData from './BaseData';

export default class ProfilePicsData extends BaseData implements IProfilePicsData {
  async updateProfilePic(userId: string, profilePicSrc: string, forCreator: boolean): Promise<void> {
    const db = await this.getDb();
    try {
      let collection: Collection<Document>;
      if (forCreator) collection = db.collection('creators');
      else collection = db.collection('users');
      await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { profilePicSrc } });
    } catch (err) {
      this.handleDatabaseError(err, 'Could not update profile picture');
    }
  }

  async fetchProfilePic(userId: string, forCreator: boolean): Promise<string | null> {
    const db = await this.getDb();
    try {
      let collection: Collection<Document>;
      if (forCreator) collection = db.collection('creators');
      else collection = db.collection('users');
      const result = await collection.findOne({ _id: new ObjectId(userId) });
      if (!result) return null;
      return result.profilePicSrc;
    } catch (err) {
      return this.handleDatabaseError(err, 'Could not fetch profile picture');
    }
  }
}
