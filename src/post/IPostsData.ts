import { IPostAttachment } from './IPostAttachment';

export interface IPostsData {
  /**
   * Insert new post into database
   * @throws DatabaseError if operation fails
   */
  insertNewPost({
    postId, userId, description, squadId,
  }: {
    postId: string,
    userId: string,
    // title: string,
    description: string,
    squadId: string,
    attachments: IPostAttachment[],
  }): Promise<{
    postId: string,
    userId: string,
    // title: string,
    description: string,
    squadId: string,
    attachments: IPostAttachment[],
  }>;

  /**
   * Fetch all posts by userId
   * @returns Array of posts, return empty array if there are no posts
   * @throws DatabaseError if operation fails
   */
  fetchAllPostsByUserId(userId: string): Promise<{
    postId: string,
    userId: string,
    description: string,
    squadId: string,
  }[]>
}
