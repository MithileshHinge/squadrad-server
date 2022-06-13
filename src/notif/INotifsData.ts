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

  /**
   * Fetches all notifs by given receiverUserId
   */
  fetchNotifsByReceiverUserId(receiverUserId: string): Promise<{
    notifId: string,
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
    seen: boolean,
    timestamp: number,
  }[]>;

  /**
   * Checks if receiver has any unseen notif
   * @returns true if there are notifs for recieverUserId with seen: false
   */
  fetchIsUnseenNotif(receiverUserId: string): Promise<Boolean>;

  /**
   * updates all notifs for receiverUserId
   */
  updateNotifsByReceiverUserId({ receiverUserId, ...updateData }: {
    receiverUserId: string,
    seen: boolean,
  }): Promise<null>;
}
