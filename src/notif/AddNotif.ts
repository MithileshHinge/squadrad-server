import FindComment from '../comment/FindComment';
import id from '../common/id';
import FindManualSubbedUsers from '../manual-sub/FindManualSubbedUsers';
import FindPost from '../post/FindPost';
import INotifsData from './INotifsData';
import NotifTypes from './NotifTypes';

export default class AddNotif {
  private findManualSubbedUsers: FindManualSubbedUsers;

  private findPost: FindPost;

  private findComment: FindComment;

  private notifsData: INotifsData;

  constructor(findManualSubbedUsers: FindManualSubbedUsers, findPost: FindPost, findComment: FindComment, notifsData: INotifsData) {
    this.findManualSubbedUsers = findManualSubbedUsers;
    this.findPost = findPost;
    this.findComment = findComment;
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

    // Don't notify if actor and receiver are the same
    if (actorId === receiverUserId) return;

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
    let notifsToInsert = notifs.map((notif) => ({
      notifId: id.createId(),
      seen: false,
      timestamp: Date.now(),
      ...notif,
    }));

    // Don't notify if actor and receiver are the same
    notifsToInsert = notifsToInsert.filter((notif) => notif.actorId !== notif.receiverUserId);

    await this.notifsData.insertNewNotifsBulk(notifsToInsert);
  }

  /** Creates a notif of NotifType NEW_POST, does not handle input validation (this use case is for internal use only!)
   * @param creatorUserId userId of creator of the post
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

  /**
   * Creates a notif of NotifType POST_LIKE, does not handle input validation (this use case is for internal use only!)
   * @param param0.userId Id of liker
   * @param param0.postId Id of liked post
   */
  async addPostLikeNotif({ userId, postId }: { userId: string, postId: string }) {
    const post = await this.findPost.findPostById({ userId, postId });
    if (!post) return;
    await this.add({
      receiverUserId: post.userId,
      type: NotifTypes.POST_LIKE,
      actorId: userId,
      actedObjectId: postId,
    });
  }

  /**
   * Creates a notif of NotifType POST_COMMENT, does not handle input validation (this use case is for internal use only!)
   * @param userId userId of commentor
   * @param postCreatorId userId of creator of post
   * @param commentId Id of comment
   */
  async addPostCommentNotif({ userId, postCreatorId, commentId }: {
    userId: string,
    postCreatorId: string,
    commentId: string,
  }) {
    await this.add({
      receiverUserId: postCreatorId,
      type: NotifTypes.POST_COMMENT,
      actorId: userId,
      actedObjectId: commentId,
    });
  }

  /**
   * Creates a notif of NotifType COMMENT_REPLY, does not handle input validation (this use case is for internal use only!)
   */
  async addCommentReplyNotif({
    userId, postCreatorId, postId, commentId, replyToCommentId,
  }: {
    userId: string,
    postCreatorId: string,
    postId: string,
    commentId: string,
    replyToCommentId: string,
  }) {
    const allCommentsOnPost = await this.findComment.findCommentsByPostId({ userId, postId });
    const parentComment = allCommentsOnPost.find((comment) => comment.commentId === replyToCommentId);
    if (!parentComment) return;

    const notifsToAdd: Array<{
      receiverUserId: string,
      type: NotifTypes,
      actorId: string,
      actedObjectId: string,
    }> = [];

    if (parentComment.userId !== postCreatorId) {
      // If parentComment does not belongs to post creator: NotifType.POST_COMMENT will be given to post creator
      notifsToAdd.push({
        receiverUserId: postCreatorId,
        type: NotifTypes.POST_COMMENT,
        actorId: userId,
        actedObjectId: commentId,
      });
    } else {
      // If parentComment belongs to post creator: NotifType.COMMENT_REPLY will be given to post creator
      notifsToAdd.push({
        receiverUserId: postCreatorId,
        type: NotifTypes.COMMENT_REPLY,
        actorId: userId,
        actedObjectId: commentId,
      });
    }

    [parentComment.userId, ...parentComment.replies.map((reply) => reply.userId)].forEach((receiverUserId) => {
      if (!notifsToAdd.find((notif) => notif.receiverUserId === receiverUserId)) {
        notifsToAdd.push({
          receiverUserId,
          type: NotifTypes.COMMENT_REPLY,
          actorId: userId,
          actedObjectId: commentId,
        });
      }
    });

    await this.addBulk(notifsToAdd);
  }

  /**
   * Creates a notif of NotifType SQUAD_SUBSCRIBED, does not handle input validation (this use case is for internal use only!)
   */
  async addSquadSubscribedNotif({
    userId, manualSubId, creatorUserId,
  }: {
    userId: string,
    manualSubId: string,
    creatorUserId: string,
  }) {
    await this.add({
      receiverUserId: creatorUserId,
      type: NotifTypes.SQUAD_SUBSCRIBED,
      actorId: userId,
      actedObjectId: manualSubId,
    });
  }
}
