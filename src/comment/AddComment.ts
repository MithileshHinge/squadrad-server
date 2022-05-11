import id from '../common/id';
import FindPost from '../post/FindPost';
import postValidator from '../post/validator';
import { validateUserId } from '../userId';
import { ICommentsData } from './ICommentsData';
import { ICommentValidator } from './validator/ICommentValidator';

export default class AddComment {
  private findPost: FindPost;

  private commentsData: ICommentsData;

  private commentValidator: ICommentValidator;

  constructor(findPost: FindPost, commentsData: ICommentsData, commentValidator: ICommentValidator) {
    this.findPost = findPost;
    this.commentsData = commentsData;
    this.commentValidator = commentValidator;
  }

  /**
   * Add Comment use case
   * @param userId Id of commentor
   * @param postId post to comment on
   * @param text comment content
   * @returns added comment, or null if user doesn't have access to post or post doesn't exist
   */
  async add({ userId, postId, text }: {
    userId: string,
    postId: string,
    text: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = postValidator.validatePostId(postId);
    const textValidated = this.commentValidator.validateText(text);

    const post = await this.findPost.findPostById({ userId: userIdValidated, postId: postIdValidated });

    if (post && !post.locked) {
      const commentId = id.createId();
      const commentAdded = await this.commentsData.insertNewComment({
        commentId,
        postId: postIdValidated,
        userId: userIdValidated,
        text: textValidated,
      });

      return {
        postId: commentAdded.postId,
        userId: commentAdded.userId,
        text: commentAdded.text,
      };
    }

    return null;
  }
}
