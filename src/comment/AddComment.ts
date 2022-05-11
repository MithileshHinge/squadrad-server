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
   * @param replyToCommentId (optional) commentId of parent comment if this is a reply
   * @returns added comment, or null if user doesn't have access to post or post doesn't exist
   * @throws ValidationError if params are invalid
   * @throws DatabaseError if database operation failed
   */
  async add({
    userId, postId, text, replyToCommentId,
  }: {
    userId: string,
    postId: string,
    text: string,
    replyToCommentId?: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = postValidator.validatePostId(postId);
    const textValidated = this.commentValidator.validateText(text);
    const replyToCommentIdValidated = replyToCommentId === undefined ? undefined : this.commentValidator.validateCommentId(replyToCommentId);

    const post = await this.findPost.findPostById({ userId: userIdValidated, postId: postIdValidated });

    // If this is a reply, check if parent comment exists, or if its a reply itself
    if (replyToCommentIdValidated) {
      const parentComment = await this.commentsData.fetchCommentById(replyToCommentIdValidated);
      if (!parentComment) return null;
      if (parentComment.replyToCommentId) return null;
    }

    if (post && !post.locked) {
      const commentId = id.createId();
      const commentAdded = await this.commentsData.insertNewComment({
        commentId,
        postId: postIdValidated,
        userId: userIdValidated,
        text: textValidated,
        replyToCommentId: replyToCommentIdValidated,
      });

      return {
        postId: commentAdded.postId,
        userId: commentAdded.userId,
        text: commentAdded.text,
        replyToCommentId: commentAdded.replyToCommentId,
      };
    }

    return null;
  }
}
