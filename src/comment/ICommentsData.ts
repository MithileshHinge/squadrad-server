export interface ICommentsData {
  insertNewComment({ postId, userId, text }: {
    postId: string,
    userId: string,
    text: string,
  }) : Promise<{
    postId: string,
    userId: string,
    text: string,
  }>;
}
