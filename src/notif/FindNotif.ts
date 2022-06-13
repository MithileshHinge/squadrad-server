import { validateUserId } from '../userId';
import INotifsData from './INotifsData';

export default class FindNotif {
  private notifsData: INotifsData;

  constructor(notifsData: INotifsData) {
    this.notifsData = notifsData;
  }

  /**
   * Finds all notifications meant for receiverUserId
   */
  async findAllNotifsForReceiver(receiverUserId: string) {
    const receiverUserIdValidated = validateUserId.validate(receiverUserId);

    const notifs = await this.notifsData.fetchNotifsByReceiverUserId(receiverUserIdValidated);

    await this.notifsData.updateNotifsByReceiverUserId({ receiverUserId: receiverUserIdValidated, seen: true });

    return notifs.map((notif) => ({
      notifId: notif.notifId,
      receiverUserId: notif.receiverUserId,
      type: notif.type,
      actorId: notif.actorId,
      actedObjectId: notif.actedObjectId,
      seen: notif.seen,
      timestamp: notif.timestamp,
    }));
  }
}
