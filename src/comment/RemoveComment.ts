import { ICommentsData } from './ICommentsData';

export default class RemoveComment {
  private commentsData: ICommentsData;

  constructor(commentsData: ICommentsData) {
    this.commentsData = commentsData;
  }

  /**
   * Removes all comments by postId, does not check access, does not validated postId
   * @throws DatabaseError if operation fails
   */
  async removeAllCommentsOnPost(postId: string) {
    await this.commentsData.deleteCommentsByPostId(postId);
  }
}
