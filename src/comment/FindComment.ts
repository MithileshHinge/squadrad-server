import FindPost from '../post/FindPost';
import postValidator from '../post/validator';
import { validateUserId } from '../userId';
import { ICommentsData } from './ICommentsData';

export default class FindComment {
  private findPost: FindPost;

  private commentsData: ICommentsData;

  constructor(findPost: FindPost, commentsData: ICommentsData) {
    this.findPost = findPost;
    this.commentsData = commentsData;
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
