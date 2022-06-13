import id from '../common/id';
import FindManualSubbedUsers from '../manual-sub/FindManualSubbedUsers';
import INotifsData from './INotifsData';
import NotifTypes from './NotifTypes';

export default class AddNotif {
  private findManualSubbedUsers: FindManualSubbedUsers;

  private notifsData: INotifsData;

  constructor(findManualSubbedUsers: FindManualSubbedUsers, notifsData: INotifsData) {
    this.findManualSubbedUsers = findManualSubbedUsers;
    this.notifsData = notifsData;
  }

  /** Creates a new notification, does not handle input validation (this use case is for internal use only!)
   *  @param param0.receiverUserId userId of notification receiver
   *  @param param0.type type of notification: must be one of NotifTypes
   *  @param param0.actorId userId of actor who triggered the notification
   *  @param param0.actedObjectId Depends on NotifType: NEW_POST - postId, POST_LIKE - postId, POST_COMMENT - commentId, COMMENT_LIKE - commentId, COMMENT_REPLY - replyCommentId, SQUAD_SUBSCRIBED - manualSubId
   */
  async add({
    receiverUserId, type, actorId, actedObjectId,
  }: {
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
  }) {
    const notifId = id.createId();
    const timestamp = Date.now();

    // seen: whether the notification is seen from the notification tray
    await this.notifsData.insertNewNotif({
      notifId, receiverUserId, type, actorId, actedObjectId, seen: false, timestamp,
    });
  }

  /** Creates new notifications in bulk, does not handle input validation (this use case is for internal use only!)
   *  @param {string} notifs[].receiverUserId userId of notification receiver
   *  @param notifs[].type type of notification: must be one of NotifTypes
   *  @param notifs[].actorId userId of actor who triggered the notification
   *  @param notifs[].actedObjectId Depends on NotifType: NEW_POST - postId, POST_LIKE - postId, POST_COMMENT - commentId, COMMENT_LIKE - commentId, COMMENT_REPLY - replyCommentId, SQUAD_SUBSCRIBED - manualSubId
   */
  async addBulk(notifs: {
    receiverUserId: string,
    type: NotifTypes,
    actorId: string,
    actedObjectId: string,
  }[]) {
    const notifsToInsert = notifs.map((notif) => ({
      notifId: id.createId(),
      seen: false,
      timestamp: Date.now(),
      ...notif,
    }));

    await this.notifsData.insertNewNotifsBulk(notifsToInsert);
  }

  /** Creates a notif of NotifType NEW_POST, does not handle input validation (this use case is for internal use only!)
   * @param creatorUserId userId of creator of the psot
   * @param postId postId of new post
   */
  async addNewPostNotif({ creatorUserId, postId }: { creatorUserId: string, postId: string }) {
    const subbedUsers = await this.findManualSubbedUsers.find({ userId: creatorUserId, onlyActive: false });
    const notifs = subbedUsers.map((user) => ({
      receiverUserId: user.userId,
      type: NotifTypes.NEW_POST,
      actorId: creatorUserId,
      actedObjectId: postId,
    }));

    await this.addBulk(notifs);
  }
}
