import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import FindSquad from '../squad/FindSquad';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';
import { IPostValidator } from './validator/IPostValidator';
import { removeUndefinedKeys } from '../common/helpers';
import MakeAttachment from '../post-attachment/MakeAttachment';
import AddNotif from '../notif/AddNotif';

export default class AddPost {
  private findSquad: FindSquad;

  private makeAttachment: MakeAttachment;

  private addNotif: AddNotif;

  private postsData: IPostsData;

  private postValidator: IPostValidator;

  constructor(findSquad: FindSquad, makeAttachment: MakeAttachment, addNotif: AddNotif, postsData: IPostsData, postValidator: IPostValidator) {
    this.findSquad = findSquad;
    this.makeAttachment = makeAttachment;
    this.addNotif = addNotif;
    this.postsData = postsData;
    this.postValidator = postValidator;
  }

  /**
   * AddPost use case: Create a new post
   * @param userId Creator's userId
   * @param description (optional) Post's description
   * @param squadId (optional) SquadId if the post belongs to a squad, post is free if this is undefined
   * @param link (optional) Link attached to the post
   * @param type (optional) If file is attached provide file attachment type, one of PostAttachmentTypes
   * @param src (optional) File temporary source relative to config.tmpDir
   * @throws ValidationError if squad does not exist, or params are invalid
   * @throws DatabaseError if operation fails
   */
  async add({
    // TODO: give all default params default values, remove default values assignment from validation lines
    userId, description, squadId, link, type, src,
  }: {
    userId: string,
    // title: string,
    description?: string,
    squadId?: string,
    link?: string,
    type?: string,
    src?: string,
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

    const linkValidated = link === undefined ? undefined : this.postValidator.validateLink(link);
    const attachment = (linkValidated !== undefined || type === undefined || src === undefined) ? undefined : await this.makeAttachment.make({ type, src });

    const postId = id.createId();

    const postToAdd = {
      postId,
      userId: userIdValidated,
      // title: titleValidated,
      description: descriptionValidated,
      squadId: squadIdValidated,
      link: linkValidated,
      attachment,
    };
    removeUndefinedKeys(postToAdd);

    const postAdded = await this.postsData.insertNewPost(postToAdd);

    await this.addNotif.addNewPostNotif({ creatorUserId: userIdValidated, postId });

    return {
      postId: postAdded.postId,
      userId: postAdded.userId,
      // title: postAdded.title,
      description: postAdded.description,
      squadId: postAdded.squadId,
      link: postAdded.link,
      attachment: postAdded.attachment,
    };
  }
}
