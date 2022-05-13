import postValidator from '../post/validator';
import { ICommentsData } from './ICommentsData';

export default class CountComments {
  private commentsData: ICommentsData;

  constructor(commentsData: ICommentsData) {
    this.commentsData = commentsData;
  }

  /**
   * Returns number of comments on a post
   * @returns number of comments, 0 if post doesn't exist
   */
  async count(postId: string) {
    const postIdValidated = postValidator.validatePostId(postId);

    const numComments = await this.commentsData.countCommentsByPostId(postIdValidated);

    return numComments;
  }
}
