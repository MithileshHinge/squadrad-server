import FindManualSub from '../manual-sub/FindManualSub';
import ManualSubStatuses from '../manual-sub/ManualSubStatuses';
import FindSquad from '../squad/FindSquad';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';

export default class FindPost {
  private postsData: IPostsData;

  private findSquad: FindSquad;

  private findManualSub: FindManualSub;

  constructor(findSquad: FindSquad, findManualSub: FindManualSub, postsData: IPostsData) {
    this.postsData = postsData;
    this.findSquad = findSquad;
    this.findManualSub = findManualSub;
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
    if (posts === []) {
      postsToReturn = []; // creator has no posts, return an empty array
    } else if (userIdValidated === creatorUserIdValidated) {
      postsToReturn = posts; // creator is asking for his own posts, return all posts
    } else {
      const squads = await this.findSquad.findAllSquadsByUserId(creatorUserIdValidated);
      if (squads === []) {
        postsToReturn = posts; // creator has no squads, return all posts
      } else {
        const manualSub = await this.findManualSub.findManualSubByUserIds(userIdValidated, creatorUserIdValidated);
        if (manualSub === null || manualSub.subscriptionStatus !== ManualSubStatuses.ACTIVE) {
          postsToReturn = posts.filter((post) => post.squadId === ''); // user has no active subscription to creator, return only free posts
        } else {
          const joinedAmount = manualSub.amount;
          postsToReturn = posts.filter((post) => {
            if (post.squadId === '') return true; // post is free
            const postSquad = squads.find((squad) => squad.squadId === post.squadId);
            return (postSquad && joinedAmount >= postSquad.amount); // return posts whose squad amount is less than/equal to joined squad's amount
          });
        }
      }
    }

    return postsToReturn.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      description: post.description,
      squadId: post.squadId,
    }));
  }
}
