import postValidator from '../post/validator';
import { validateUserId } from '../userId';
import { IPostLikesData } from './IPostLikesData';

export default class CheckPostLike {
  private postLikesData: IPostLikesData;

  constructor(postLikesData: IPostLikesData) {
    this.postLikesData = postLikesData;
  }

  /**
   * CheckPostLike use case: Checks if user has already liked a post
   * @param userId: The user to check
   * @param postId: The post to check
   * @returns Promise that resolves to True if user has liked the post, otherwise false
   */
  async check({ userId, postId }: {
    userId: string,
    postId: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = postValidator.validatePostId(postId);

    const isPostLiked = await this.postLikesData.fetchLike({ userId: userIdValidated, postId: postIdValidated });

    return isPostLiked;
  }
}
