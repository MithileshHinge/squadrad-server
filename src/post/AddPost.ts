import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import FindSquad from '../squad/FindSquad';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';
import { IPostValidator } from './validator/IPostValidator';

export default class AddPost {
  private findSquad: FindSquad;

  private postsData: IPostsData;

  private postValidator: IPostValidator;

  constructor(findSquad: FindSquad, postsData: IPostsData, postValidator: IPostValidator) {
    this.findSquad = findSquad;
    this.postsData = postsData;
    this.postValidator = postValidator;
  }

  /**
   * AddPost use case: Create a new post
   * @throws ValidationError if squad does not exist, or params are invalid
   * @throws DatabaseError if operation fails
   */
  async add({
    userId, description, squadId,
  }: {
    userId: string,
    // title: string,
    description?: string,
    squadId?: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    // const titleValidated = this.postValidator.validateTitle(title);
    const descriptionValidated = description === undefined ? '' : this.postValidator.validateDescription(description);

    let squadIdValidated = '';
    if (squadId !== undefined && squadId !== '') {
      const squad = await this.findSquad.findSquadById(squadId);
      if (squad && squad.userId === userIdValidated) squadIdValidated = squad.squadId;
      else throw new ValidationError('Squad does not exist');
    }

    const postId = id.createId();

    const postAdded = await this.postsData.insertNewPost({
      postId,
      userId: userIdValidated,
      // title: titleValidated,
      description: descriptionValidated,
      squadId: squadIdValidated,
    });

    return {
      postId: postAdded.postId,
      userId: postAdded.userId,
      // title: postAdded.title,
      description: postAdded.description,
      squadId: postAdded.squadId,
    };
  }
}
