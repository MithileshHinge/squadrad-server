import id from '../common/id';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';
import { IPostValidator } from './validator/IPostValidator';

export default class AddPost {
  private postsData: IPostsData;

  private postValidator: IPostValidator;

  constructor(postsData: IPostsData, postValidator: IPostValidator) {
    this.postsData = postsData;
    this.postValidator = postValidator;
  }

  /**
   * AddPost use case: Create a new post
   * @throws ValidationError
   * @throws DatabaseError if operation fails
   */
  async add({
    userId, description,
  }: {
    userId: string,
    // title: string,
    description?: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    // const titleValidated = this.postValidator.validateTitle(title);
    const descriptionValidated = description === undefined ? '' : this.postValidator.validateDescription(description);

    const postId = id.createId();

    const postAdded = await this.postsData.insertNewPost({
      postId,
      userId: userIdValidated,
      // title: titleValidated,
      description: descriptionValidated,
    });

    return {
      postId: postAdded.postId,
      userId: postAdded.userId,
      // title: postAdded.title,
      description: postAdded.description,
    };
  }
}
