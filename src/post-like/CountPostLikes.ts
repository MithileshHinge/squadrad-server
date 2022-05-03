import postValidator from '../post/validator';
import { IPostLikesData } from './IPostLikesData';

export default class CountPostLikes {
  private postLikesData: IPostLikesData;

  constructor(postLikesData: IPostLikesData) {
    this.postLikesData = postLikesData;
  }

  /**
   * Get total likes on a post
   * @param postId Id of the post
   */
  async count(postId: string) {
    const postIdValidated = postValidator.validatePostId(postId);

    const numLikes = await this.postLikesData.fetchLikesCount(postIdValidated);

    return numLikes;
  }
}
