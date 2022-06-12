import { validateUserId } from '../userId';
import FindPost from './FindPost';
import { IPostsData } from './IPostsData';
import { IPostValidator } from './validator/IPostValidator';

export default class EditPost {
  private findPost: FindPost;

  private postsData: IPostsData;

  private postValidator: IPostValidator;

  constructor(findPost: FindPost, postsData: IPostsData, postValidator: IPostValidator) {
    this.findPost = findPost;
    this.postsData = postsData;
    this.postValidator = postValidator;
  }

  /**
   * Edit post: Can edit description only, userId required to check access
   */
  async edit({ userId, postId, description }: { userId: string, postId: string, description: string }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = this.postValidator.validatePostId(postId);
    const descriptionValidated = this.postValidator.validateDescription(description);

    const post = await this.findPost.findPostById({ userId: userIdValidated, postId: postIdValidated });

    if (!post || post.userId !== userIdValidated) return; // Post does not exist, or post does not belong to this creator

    await this.postsData.updatePost({ postId: postIdValidated, description: descriptionValidated });
  }
}
