import { forEachAsync } from '../common/helpers';
import FindManualSub from '../manual-sub/FindManualSub';
import ManualSubStatuses from '../manual-sub/ManualSubStatuses';
import FindAttachment from '../post-attachment/FindAttachment';
import FindSquad from '../squad/FindSquad';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';
import { IPostValidator } from './validator/IPostValidator';

export default class FindPost {
  private postsData: IPostsData;

  private postValidator: IPostValidator;

  private findSquad: FindSquad;

  private findManualSub: FindManualSub;

  private findAttachment: FindAttachment;

  constructor(findSquad: FindSquad, findManualSub: FindManualSub, findAttachment: FindAttachment, postsData: IPostsData, postValidator: IPostValidator) {
    this.postsData = postsData;
    this.postValidator = postValidator;
    this.findSquad = findSquad;
    this.findManualSub = findManualSub;
    this.findAttachment = findAttachment;
  }

  /**
   * Static method to check if a user has access to a post
   * @param userId user's userId
   * @param post the post to be checked
   * @param squad the squad to which the post belongs
   * @param manualSub the manualSub between user and the creator of the post
   * @returns true if access granted
   */
  static checkPostAccess({
    userId,
    post,
    squad,
    manualSub,
  }: { userId: string, post: any, squad: any, manualSub: any }) {
    if (userId === post.userId) return true;
    if (!squad) return true; // Post is free or Squad no longer exists so post is free
    if (manualSub && manualSub.amount >= squad.amount
      && manualSub.subscriptionStatus === ManualSubStatuses.ACTIVE) return true;
    return false;
  }

  /**
   * Find posts by creator's user Id, handles access as well
   * @returns Array of creator's posts
   * @throws ValidationError if params are invalid
   * @throws DatabaseError if operation failed
   */
  async findPostsByUserId({ userId, creatorUserId }: {
    userId?: string,
    creatorUserId: string,
  }) {
    const userIdValidated = userId === undefined ? undefined : validateUserId.validate(userId);
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);

    const posts = await this.postsData.fetchAllPostsByUserId(creatorUserIdValidated);
    let postsToReturn: Array<typeof posts[0] & { locked: boolean }>;

    if (posts.length <= 0) {
      postsToReturn = []; // creator has no posts, return an empty array
    } else if (userIdValidated === undefined) {
      postsToReturn = posts.map((post) => ({ ...post, locked: (post.squadId !== '') })); // user is unauthorized, only unlock free posts
    } else if (userIdValidated === creatorUserIdValidated) {
      postsToReturn = posts.map((post) => ({ ...post, locked: false }));
    } else {
      const squads = await this.findSquad.findAllSquadsByUserId(creatorUserIdValidated);
      const manualSub = await this.findManualSub.findManualSubByUserIds(userIdValidated, creatorUserIdValidated);
      postsToReturn = posts.map((post) => {
        const squad = post.squadId === '' ? null : squads.find((s) => s.squadId === post.squadId);
        const isAccessible = FindPost.checkPostAccess({
          userId: userIdValidated,
          post,
          squad,
          manualSub,
        });
        if (isAccessible) return { ...post, locked: false };
        return { ...post, locked: true };
      });
    }

    const postsToReturnWithLinkAndAttachment: any[] = [];
    await forEachAsync(postsToReturn, async (post) => {
      if (post.locked) {
        postsToReturnWithLinkAndAttachment.push({
          ...post,
          link: post.link ? 'locked' : undefined,
          attachment: post.attachment ? { type: post.attachment.type } : undefined,
        });
      } else {
        postsToReturnWithLinkAndAttachment.push({
          ...post,
          attachment: post.attachment ? { type: post.attachment.type, src: await this.findAttachment.getSrcFromId(post.attachment.attachmentId) } : undefined,
        });
      }
    });

    return postsToReturnWithLinkAndAttachment.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      description: post.description,
      squadId: post.squadId,
      link: post.link,
      attachment: post.attachment,
      locked: post.locked,
    }));
  }

  async findPostById({ userId, postId }: { userId?: string, postId: string }) {
    const userIdValidated = userId === undefined ? undefined : validateUserId.validate(userId);
    const postIdValidated = this.postValidator.validatePostId(postId);

    const post = await this.postsData.fetchPostById(postIdValidated);
    if (!post) return null;

    let postToReturn: any;

    if (userIdValidated === undefined) {
      if (post.squadId === '') {
        postToReturn = {
          ...post,
          locked: false,
          attachment: post.attachment ? { type: post.attachment.type, src: await this.findAttachment.getSrcFromId(post.attachment.attachmentId) } : undefined,
        };
      } else {
        postToReturn = {
          ...post,
          locked: true,
          link: post.link ? 'locked' : undefined,
          attachment: post.attachment ? { type: post.attachment.type } : undefined,
        };
      }
    } else {
      const squad = post.squadId === '' ? null : await this.findSquad.findSquadById(post.squadId);
      const manualSub = await this.findManualSub.findManualSubByUserIds(userIdValidated, post.userId);

      if (FindPost.checkPostAccess({
        userId: userIdValidated,
        post,
        squad,
        manualSub,
      })) {
        postToReturn = {
          ...post,
          locked: false,
          attachment: post.attachment ? { type: post.attachment.type, src: await this.findAttachment.getSrcFromId(post.attachment.attachmentId) } : undefined,
        };
      } else {
        postToReturn = {
          ...post,
          locked: true,
          link: post.link ? 'locked' : undefined,
          attachment: post.attachment ? { type: post.attachment.type } : undefined,
        };
      }
    }
    return {
      postId: postToReturn.postId,
      userId: postToReturn.userId,
      description: postToReturn.description,
      squadId: postToReturn.squadId,
      link: postToReturn.link,
      attachment: postToReturn.attachment,
      locked: postToReturn.locked,
    };
  }
}
