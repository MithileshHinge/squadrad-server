import { forEachAsync } from '../common/helpers';
import FindPost from '../post/FindPost';
import { validateUserId } from '../userId';
import { ICommentsData } from './ICommentsData';
import { ICommentValidator } from './validator/ICommentValidator';

export default class RemoveComment {
  private findPost: FindPost;

  private commentsData: ICommentsData;

  private commentValidator: ICommentValidator;

  constructor(findPost: FindPost, commentsData: ICommentsData, commentValidator: ICommentValidator) {
    this.commentsData = commentsData;
    this.commentValidator = commentValidator;
    this.findPost = findPost;
  }

  /**
   * Removes a comment, needs userId to check access. Creator of the post can also remove a comment.
   * @param userId id of user requesting to remove the comment
   * @param commentId id of comment
   */
  async removeCommentById({ userId, commentId }: { userId: string, commentId: string }) {
    const userIdValidated = validateUserId.validate(userId);
    const commentIdValidated = this.commentValidator.validateCommentId(commentId);

    const comment = await this.commentsData.fetchCommentById(commentIdValidated);

    if (!comment) return; // Comment does not exist

    // Check access - only commentor and post creator can delete a comment
    if (comment.userId !== userIdValidated) {
      const post = await this.findPost.findPostById({ userId: userIdValidated, postId: comment.postId });
      if (!post || post.userId !== userIdValidated) {
        return; // Requestor does not have access to delete this comment
      }
    }

    await this.commentsData.deleteCommentById(commentIdValidated);

    // Delete replies to the comment
    const replies = await this.commentsData.fetchCommentsByReplyToCommentId(commentIdValidated);

    await forEachAsync(replies, async (reply) => {
      await this.commentsData.deleteCommentById(reply.commentId);
    });
  }

  /**
   * Removes all comments by postId, does not check access, does not validated postId
   * @throws DatabaseError if operation fails
   */
  async removeAllCommentsOnPost(postId: string) {
    await this.commentsData.deleteCommentsByPostId(postId);
  }
}
