export interface IPostsData {
  insertNewPost({
    postId, userId, description, squadId,
  }: {
    postId: string,
    userId: string,
    // title: string,
    description: string,
    squadId: string,
  }): Promise<{
    postId: string,
    userId: string,
    // title: string,
    description: string,
    squadId: string,
  }>;
}
