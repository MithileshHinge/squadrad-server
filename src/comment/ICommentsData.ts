export interface ICommentsData {
  insertNewComment({
    commentId, postId, userId, text, replyToCommentId,
  }: {
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }) : Promise<{
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }>;

  fetchCommentById(commentId: string): Promise<{
    commentId: string,
    postId: string,
    userId: string,
    text: string,
    replyToCommentId?: string,
  }>;
}
