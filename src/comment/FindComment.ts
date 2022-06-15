import FindPost from '../post/FindPost';
import postValidator from '../post/validator';
import { validateUserId } from '../userId';
import { ICommentsData } from './ICommentsData';
import { ICommentValidator } from './validator/ICommentValidator';

export default class FindComment {
  private findPost: FindPost;

  private commentsData: ICommentsData;

  private commentValidator: ICommentValidator;

  constructor(findPost: FindPost, commentsData: ICommentsData, commentValidator: ICommentValidator) {
    this.findPost = findPost;
    this.commentsData = commentsData;
    this.commentValidator = commentValidator;
  }

  /**
   * Get comment by commentId, checks access
   * @param userId userId of user asking for the comment
   * @param commentId Id of comment being requested
   * @returns Comment in the format { commentId, userId, postId, text, replyToCommentId }
   */
  async findCommentById({ userId, commentId }: {
    userId: string,
    commentId: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const commentIdValidated = this.commentValidator.validateCommentId(commentId);

    const comment = await this.commentsData.fetchCommentById(commentIdValidated);
    if (!comment) return null;
    const post = await this.findPost.findPostById({ userId: userIdValidated, postId: comment.postId });

    if (!post || post.locked) return null;
    return {
      commentId: comment.commentId,
      userId: comment.userId,
      postId: comment.postId,
      text: comment.text,
      replyToCommentId: comment.replyToCommentId,
    };
  }

  /**
   * Get all comments on a post, checks access
   * @param userId userId of user asking for comments, needed to check access
   * @param postId postId of post
   * @returns Array of comments in the format: [{ commentId, userId, text, replies: [{ commentId, userId, text }] }]
   * @throws VaidationError if params are invalid
   * @throws DatabaseError if database operation fails
   */
  async findCommentsByPostId({ userId, postId }: {
    userId: string,
    postId: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const postIdValidated = postValidator.validatePostId(postId);

    const post = await this.findPost.findPostById({ userId: userIdValidated, postId: postIdValidated });

    if (post && !post.locked) {
      const comments = await this.commentsData.fetchCommentsByPostId(postId);
      if (comments.length <= 0) return [];
      const commentsToReturn: Array<{
        commentId: string,
        userId: string,
        text: string,
        replies: Array<{
          commentId: string, userId: string, text: string,
        }>
      }> = [];

      // Find all root comments
      comments.forEach((comment) => {
        if (!comment.replyToCommentId) {
          commentsToReturn.push({
            commentId: comment.commentId,
            userId: comment.userId,
            text: comment.text,
            replies: [],
          });
        }
      });

      // Find all replies
      comments.forEach((comment) => {
        if (comment.replyToCommentId) {
          const parentComment = commentsToReturn.find((c) => c.commentId === comment.replyToCommentId);
          if (parentComment) {
            parentComment.replies.push({
              commentId: comment.commentId,
              userId: comment.userId,
              text: comment.text,
            });
          }
        }
      });

      return commentsToReturn;
    }

    return [];
  }
}
