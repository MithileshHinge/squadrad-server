import { IPostLikesData } from './IPostLikesData';

export default class RemovePostLike {
  private postLikesData: IPostLikesData;

  constructor(postLikesData: IPostLikesData) {
    this.postLikesData = postLikesData;
  }

  /**
   * Remove all likes on a post, does not check access, does not validate postId
   */
  async removeLikesOnPostId(postId: string) {
    await this.postLikesData.deleteLikesByPostId(postId);
  }
}
