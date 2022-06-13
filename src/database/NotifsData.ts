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
}
