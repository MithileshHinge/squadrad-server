import NotifTypes from './NotifTypes';

export default interface INotifsData {
  /**
   * Insert a new notification
   */
  insertNewNotif({
    notifId, receiverUserId, type, actorId, actedObjectId, seen, timestamp,
  }: {
    notifId: string,
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
    seen: boolean,
    timestamp: number,
  }): Promise<null>;

  /**
   * Inserts new notifications in bulk
   */
  insertNewNotifsBulk(notifs: {
    notifId: string,
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
    seen: boolean,
    timestamp: number,
  }[]): Promise<null>;
}
