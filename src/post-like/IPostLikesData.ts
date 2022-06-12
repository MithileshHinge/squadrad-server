export interface IPostLikesData {

  /**
   * Insert a new like
   * @param postId Id of post to which record is added
   * @param userId userId to be recorded
   * @returns Promise which resolved to Total number of likes after operation
   */
  insertNewLike({ postId, userId }: {
    postId: string,
    userId: string,
  }): Promise<number>;

  /**
   * Fetch a like by user on post
   * @param postId Id of post
   * @param userId Id of user to check
   * @returns Promise which resolves to True if userId record exists under postId, otherwise False
   */
  fetchLike({ postId, userId }: {
    postId: string,
    userId: string,
  }): Promise<boolean>;

  /**
   * Fetch post total likes count
   * @param postId Id of post
   * @returns Promise which resolves to total number of likes on the post
   */
  fetchLikesCount(postId: string): Promise<number>;

  /**
   * Delete a like record from post
   * @param postId Id of post to delete from
   * @param userId userId record to delete
   * @returns Promise which resolves to Total number of likes after operation
   */
  deleteLike({ postId, userId }: {
    postId: string,
    userId: string,
  }): Promise<number>;

  /**
   * Delete all likes by postId
   * @param postId Id of post to delete all likes
   */
  deleteLikesByPostId(postId: string): Promise<null>;
}
