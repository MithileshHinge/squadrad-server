export interface ICommentsData {
  /**
   * Insert new comment
   * @returns inserted comment
   */
  insertNewComment({
    commentId, postId, userId, text, replyToCommentId, timestamp,
  }: {
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
    timestamp: number,
  }) : Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
    timestamp: number,
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
    timestamp: number,
  } | null>;

  /**
   * Fetch replies by parent comment's commentId
   * @param replyToCommentId parent comment's commentId
   * @returns Array of replies
   */
  fetchCommentsByReplyToCommentId(replyToCommentId: string): Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId: string,
    timestamp: number,
  }[]>;

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
    timestamp: number,
  }[]>;

  /**
   * Count total number of comments on a post
   * @returns number of comments
   */
  countCommentsByPostId(postId: string): Promise<Number>;

  /**
   * Delete a comment by commentId
   */
  deleteCommentById(commentId: string): Promise<null>;

  /**
   * Delete comments by postId
   */
  deleteCommentsByPostId(postId: string): Promise<null>;
}
