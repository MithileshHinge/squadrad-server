import postValidator from '../post/validator';
import { validateUserId } from '../userId';
import CheckPostLike from './CheckPostLike';
import { IPostLikesData } from './IPostLikesData';

export default class TogglePostLike {
  private postLikesData: IPostLikesData;

  private checkPostLike: CheckPostLike;

  constructor(checkPostLike: CheckPostLike, postLikesData: IPostLikesData) {
    this.postLikesData = postLikesData;
    this.checkPostLike = checkPostLike;
  }

  /**
   * TogglePostLike use case: Like/Unlike a post
   * @param userId: The user who is liking the post
   * @param postId: The Id of the post to like
   * @returns numLikes: Total number of likes
   */
  async toggle({ userId, postId }: {
    userId: string,
    postId: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = postValidator.validatePostId(postId);

    const isPostLiked = await this.checkPostLike.check({ userId: userIdValidated, postId: postIdValidated });

    let numLikes: number;
    if (!isPostLiked) {
      numLikes = await this.postLikesData.insertNewLike({
        postId: postIdValidated,
        userId: userIdValidated,
      });
    } else {
      numLikes = await this.postLikesData.deleteLike({
        postId: postIdValidated,
        userId: userIdValidated,
      });
    }

    return { numLikes };
  }
}
