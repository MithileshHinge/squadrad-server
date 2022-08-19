/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { IUsersData } from '../user/IUsersData';
import BaseData from './BaseData';

export default class UsersData extends BaseData implements IUsersData {
  async insertNewUser({
    userId,
    fullName,
    email,
    password,
    verified,
  }: {
    userId: string,
    fullName: string,
    email: string,
    password: string,
    verified: boolean,
  }): Promise<{ userId: string; fullName: string; email: string; }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').insertOne({
        _id: new ObjectId(userId),
        fullName,
        email,
        password,
        verified,
      });
      return {
        userId: result.insertedId.toString(),
        fullName,
        email,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new user into database');
    }
  }

  /*
  async fetchAllUsers(): Promise<{
    userId: string,
    fullName: string,
    email: string,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').find().project<{
        userId: string,
        fullName: string,
        email: string,
      }>({ password: false })
        .toArray();
      return result;
    } catch (err: any) {
      return handleDatabaseError(err, 'Could not fetch all users');
    }
  }
  */

  async fetchUserById(userId: string): Promise<{
    userId: string,
    fullName: string,
    email: string,
    verified: boolean,
  } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').findOne({ _id: new ObjectId(userId) }, { projection: { password: false } });
      if (!result) return null;
      return {
        userId: result._id.toString(),
        fullName: result.fullName,
        email: result.email,
        verified: result.verified,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch user');
    }
  }

  async fetchAllUsersByIds(userIds: string[]): Promise<{
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
    verified: boolean,
  }[]> {
    const db = await this.getDb();
    try {
      const userObjectIds = userIds.map((userId) => new ObjectId(userId));
      const result = await db.collection('users').find({ _id: { $in: userObjectIds } }).toArray();

      return result.map((doc) => ({
        userId: doc._id.toString(),
        fullName: doc.fullName,
        email: doc.email,
        profilePicSrc: doc.profilePicSrc,
        verified: doc.verified,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch all users by userIds');
    }
  }

  async fetchUserByEmail(email: string): Promise<{
    userId: string,
    fullName: string,
    email: string,
    verified: boolean,
  } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').findOne({ email }, { projection: { password: false } });
      if (!result) return null;
      return {
        userId: result._id.toString(),
        fullName: result.fullName,
        email: result.email,
        verified: result.verified,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch user');
    }
  }

  async updateUser({ userId, ...updateData }: {
    userId: string,
    fullName?: string,
    verified?: boolean,
  }): Promise<{ userId: string, fullName?: string, verified?: boolean }> {
    const db = await this.getDb();
    try {
      await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
      return {
        userId,
        ...updateData,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not update user');
    }
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const db = await this.getDb();
    try {
      await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { password: newPassword } });
    } catch (err: any) {
      this.handleDatabaseError(err, 'Could not update password');
    }
  }

  async fetchPasswordById(userId: string): Promise<string> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').findOne({ _id: new ObjectId(userId) }, { projection: { password: true } });
      return result!.password;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch password');
    }
  }
}
