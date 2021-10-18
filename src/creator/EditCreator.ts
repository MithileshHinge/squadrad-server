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
  async edit(creatorInfo: { userId: string, pageName?: string, bio?: string, isPlural?: boolean }): Promise<{
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
  }> {
    const pageNameValidated = creatorInfo.pageName === undefined ? undefined : this.creatorValidator.validatePageName(creatorInfo.pageName);
    const bioValidated = creatorInfo.bio === undefined ? undefined : this.creatorValidator.validateBio(creatorInfo.bio);

    const creatorToUpdate = {
      userId: creatorInfo.userId,
      pageName: pageNameValidated,
      bio: bioValidated,
      isPlural: creatorInfo.isPlural,
    };
    const creatorEdited = await this.creatorsData.updateCreator(creatorToUpdate);

    return {
      userId: creatorEdited.userId,
      pageName: creatorEdited.pageName,
      bio: creatorEdited.bio,
      isPlural: creatorEdited.isPlural,
    };
  }
}