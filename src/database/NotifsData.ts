/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import INotifsData from '../notif/INotifsData';
import NotifTypes from '../notif/NotifTypes';
import BaseData from './BaseData';

export default class NotifsData extends BaseData implements INotifsData {
  async insertNewNotif({
    notifId, receiverUserId, type, actorId, actedObjectId, seen, timestamp,
  }: {
    notifId: string,
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
    seen: boolean,
    timestamp: number,
  }): Promise<null> {
    const db = await this.getDb();
    try {
      await db.collection('notifs').insertOne({
        _id: new ObjectId(notifId),
        receiverUserId,
        type,
        actorId,
        actedObjectId,
        seen,
        timestamp,
      });
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new notif');
    }
  }

  async insertNewNotifsBulk(notifs: {
    notifId: string,
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
    seen: boolean,
    timestamp: number,
  }[]): Promise<null> {
    const db = await this.getDb();
    try {
      await db.collection('notifs').insertMany(notifs.map(({
        notifId, receiverUserId, type, actorId, actedObjectId, seen, timestamp,
      }) => ({
        _id: new ObjectId(notifId),
        receiverUserId,
        type,
        actorId,
        actedObjectId,
        seen,
        timestamp,
      })));
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not insert new notifs in bulk');
    }
  }

  async fetchNotifsByReceiverUserId(receiverUserId: string): Promise<{
    notifId: string,
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
    seen: boolean,
    timestamp: number,
  }[]> {
    const db = await this.getDb();
    try {
      const result = await db.collection('notifs').find({ receiverUserId }).toArray();
      return result.map((notif) => ({
        notifId: notif._id.toString(),
        receiverUserId: notif.receiverUserId,
        type: notif.type,
        actorId: notif.actorId,
        actedObjectId: notif.actedObjectId,
        seen: notif.seen,
        timestamp: notif.timestamp,
      }));
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not fetch notifs by receiverUserId');
    }
  }

  async updateNotifsByReceiverUserId({ receiverUserId, ...updateData }: {
    receiverUserId: string,
    seen: boolean,
  }): Promise<null> {
    const db = await this.getDb();
    try {
      await db.collection('notifs').updateMany({ receiverUserId }, { $set: updateData });
      return null;
    } catch (err: any) {
      return this.handleDatabaseError(err, 'Could not update notifs by receiverUserId');
    }
  }
}
