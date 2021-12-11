export interface IPostsData {
  insertNewPost({
    postId, userId, description,
  }: {
    postId: string,
    userId: string,
    // title: string,
    description: string,
  }): Promise<{
    postId: string,
    userId: string,
    // title: string,
    description: string,
  }>;
}
