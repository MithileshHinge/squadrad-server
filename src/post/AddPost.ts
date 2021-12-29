import crypto from 'crypto';
import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import FindSquad from '../squad/FindSquad';
import { validateUserId } from '../userId';
import { IPostsData } from './IPostsData';
import { IPostAttachment, PostAttachmentType } from './IPostAttachment';
import { IPostValidator } from './validator/IPostValidator';
import { emptyDir, forEachAsync, moveFile } from '../common/helpers';

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
    // TODO: give all default params default values, remove default values assignment from validation lines
    userId, description, squadId, attachments = [],
  }: {
    userId: string,
    // title: string,
    description?: string,
    squadId?: string,
    attachments?: IPostAttachment[],
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

    const attachmentsValidated = this.postValidator.validateAttachments(attachments);
    const postId = id.createId();

    if (attachmentsValidated.some((attachment) => attachment.type === PostAttachmentType.IMAGE)) {
      const postsDir = `posts/${process.env.NODE_ENV === 'test' ? 'test/' : ''}`;
      const dest = `${postId}/`;
      await emptyDir(postsDir + dest);

      await forEachAsync(attachmentsValidated, async (attachment) => {
        if (attachment.type === PostAttachmentType.IMAGE) {
          const randomFilename = crypto.pseudoRandomBytes(4).toString('hex');
          await moveFile(attachment.src, postsDir + dest + randomFilename);
          // eslint-disable-next-line no-param-reassign
          attachment.src = dest + randomFilename;
        }
      });
    }

    const postAdded = await this.postsData.insertNewPost({
      postId,
      userId: userIdValidated,
      // title: titleValidated,
      description: descriptionValidated,
      squadId: squadIdValidated,
      attachments: attachmentsValidated,
    });

    return {
      postId: postAdded.postId,
      userId: postAdded.userId,
      // title: postAdded.title,
      description: postAdded.description,
      squadId: postAdded.squadId,
      attachments: postAdded.attachments,
    };
  }
}
