import ValidationError from '../common/errors/ValidationError';
import { removeUndefinedKeys } from '../common/helpers';
import { validateUserId } from '../userId';
import { ICreatorsData } from './ICreatorsData';
import { ICreatorValidator } from './validator/ICreatorValidator';

export default class EditCreator {
  private creatorsData: ICreatorsData;

  private creatorValidator: ICreatorValidator;

  constructor(creatorsData: ICreatorsData, creatorValidator: ICreatorValidator) {
    this.creatorsData = creatorsData;
    this.creatorValidator = creatorValidator;
  }

  /**
   * EditCreator use case: Only allowed fields can be edited. userId must be provided.
   * @throws ValidationError if invalid parameters are provided
   * @throws DatabaseError if operation fails
   */
  async edit(creatorInfo: { userId: string, pageName?: string, bio?: string, isPlural?: boolean, showTotalSquadMembers?: boolean, about?: string }): Promise<{
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
    showTotalSquadMembers?: boolean,
    about?: string,
  }> {
    const userIdValidated = validateUserId.validate(creatorInfo.userId);
    const pageNameValidated = creatorInfo.pageName === undefined ? undefined : this.creatorValidator.validatePageName(creatorInfo.pageName);
    const bioValidated = creatorInfo.bio === undefined ? undefined : this.creatorValidator.validateBio(creatorInfo.bio);
    const isPluralValidated = creatorInfo.isPlural === undefined ? undefined : this.creatorValidator.validateIsPlural(creatorInfo.isPlural);
    const showTotalSquadMembersValidated = creatorInfo.showTotalSquadMembers === undefined ? undefined : this.creatorValidator.validateShowTotalSquadMembers(creatorInfo.showTotalSquadMembers);
    const aboutValidated = creatorInfo.about === undefined ? undefined : this.creatorValidator.validateAbout(creatorInfo.about);
    const creatorToUpdate = {
      userId: userIdValidated,
      pageName: pageNameValidated,
      bio: bioValidated,
      isPlural: isPluralValidated,
      showTotalSquadMembers: showTotalSquadMembersValidated,
      about: aboutValidated,
    };

    removeUndefinedKeys(creatorToUpdate);
    if (Object.keys(creatorToUpdate).length <= 1) throw new ValidationError('Nothing to update');
    const creatorEdited = await this.creatorsData.updateCreator(creatorToUpdate);

    return {
      userId: creatorEdited.userId,
      pageName: creatorEdited.pageName,
      bio: creatorEdited.bio,
      isPlural: creatorEdited.isPlural,
      showTotalSquadMembers: creatorEdited.showTotalSquadMembers,
      about: creatorEdited.about,
    };
  }
}
