import FindManualSub from '../manual-sub/FindManualSub';
import ManualSubStatuses from '../manual-sub/ManualSubStatuses';
import FindSquad from '../squad/FindSquad';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';
import { IPostValidator } from './validator/IPostValidator';

export default class FindPost {
  private postsData: IPostsData;

  private postValidator: IPostValidator;

  private findSquad: FindSquad;

  private findManualSub: FindManualSub;

  constructor(findSquad: FindSquad, findManualSub: FindManualSub, postsData: IPostsData, postValidator: IPostValidator) {
    this.postsData = postsData;
    this.postValidator = postValidator;
    this.findSquad = findSquad;
    this.findManualSub = findManualSub;
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
    userId: string,
    creatorUserId: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);

    let postsToReturn: typeof posts;

    const posts = await this.postsData.fetchAllPostsByUserId(creatorUserIdValidated);
    if (posts.length <= 0) {
      postsToReturn = []; // creator has no posts, return an empty array
    } else if (userIdValidated === creatorUserIdValidated) {
      postsToReturn = posts;
    } else {
      const squads = await this.findSquad.findAllSquadsByUserId(creatorUserIdValidated);
      const manualSub = await this.findManualSub.findManualSubByUserIds(userIdValidated, creatorUserIdValidated);
      postsToReturn = posts.filter((post) => {
        const squad = post.squadId === '' ? null : squads.find((s) => s.squadId === post.squadId);
        return FindPost.checkPostAccess({
          userId: userIdValidated,
          post,
          squad,
          manualSub,
        });
      });
    }

    return postsToReturn.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      description: post.description,
      squadId: post.squadId,
      attachment: post.attachment,
    }));
  }

  async findPostById({ userId, postId }: { userId: string, postId: string }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = this.postValidator.validatePostId(postId);

    const post = await this.postsData.fetchPostById(postIdValidated);
    if (!post) return null;
    const squad = post.squadId === '' ? null : await this.findSquad.findSquadById(post.squadId);
    const manualSub = await this.findManualSub.findManualSubByUserIds(userIdValidated, post.userId);

    if (FindPost.checkPostAccess({
      userId: userIdValidated,
      post,
      squad,
      manualSub,
    })) {
      return {
        postId: post.postId,
        userId: post.userId,
        description: post.description,
        squadId: post.squadId,
        attachment: post.attachment,
      };
    }
    return null;
  }
}
