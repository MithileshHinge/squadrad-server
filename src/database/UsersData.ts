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
  }: {
    userId: string,
    fullName: string,
    email: string,
    password: string,
  }): Promise<{ userId: string; fullName: string; email: string; }> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').insertOne({
        _id: new ObjectId(userId),
        fullName,
        email,
        password,
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
    profilePicSrc: string,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').find().project<{
        userId: string,
        fullName: string,
        email: string,
        profilePicSrc: string,
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
    profilePicSrc: string,
  } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').findOne({ _id: new ObjectId(userId) }, { projection: { password: false } });
      if (!result) return null;
      return {
        userId: result._id.toString(),
        fullName: result.fullName,
        email: result.email,
        profilePicSrc: result.profilePicSrc,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch user');
    }
  }

  async fetchUserByEmail(email: string): Promise<{
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  } | null> {
    const db = await this.getDb();
    try {
      const result = await db.collection('users').findOne({ email }, { projection: { password: false } });
      if (!result) return null;
      return {
        userId: result._id.toString(),
        fullName: result.fullName,
        email: result.email,
        profilePicSrc: result.profilePicSrc,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch user');
    }
  }

  async updateUser({ userId, ...updateData }: {
    userId: string,
    fullName?: string,
  }): Promise<{ userId: string, fullName?: string }> {
    const db = await this.getDb();
    try {
      db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
      return {
        userId,
        ...updateData,
      };
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch user');
    }
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const db = await this.getDb();
    try {
      db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { password: newPassword } });
    } catch (err: any) {
      this.handleDatabaseError(err, 'Could not fetch user');
    }
  }
}
