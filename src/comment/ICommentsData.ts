export interface ICommentsData {
  /**
   * Insert new comment
   * @returns inserted comment
   */
  insertNewComment({
    commentId, postId, userId, text, replyToCommentId,
  }: {
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }) : Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }>;

  /**
   * Fetch comment by commentId
   * @returns comment or null if commentId not found
   */
  fetchCommentById(commentId: string): Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  } | null>;

  /**
   * Fetch comments on a post
   * @returns Array of comments in format [{ commentId, postId, userId, text, replyToCommentId }]
   * @returns empty array [] if no comments found
   */
  fetchCommentsByPostId(postId: string): Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }[]>;
}
