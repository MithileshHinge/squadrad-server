export interface ICommentsData {
  insertNewComment({
    commentId, postId, userId, text,
  }: {
    commentId: string,
    postId: string,
    userId: string,
    text: string,
  }) : Promise<{
    postId: string,
    userId: string,
    text: string,
  }>;
}
