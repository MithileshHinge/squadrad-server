import ValidationError from '../common/errors/ValidationError';
import { IUsersData } from '../user/IUsersData';
import { ICreatorsData } from './ICreatorsData';
import { ICreatorValidator } from './validator/ICreatorValidator';

export default class BecomeCreator {
  private usersData: IUsersData;

  private creatorsData: ICreatorsData;

  private creatorValidator: ICreatorValidator;

  constructor(usersData: IUsersData, creatorsData: ICreatorsData, creatorValidator: ICreatorValidator) {
    this.usersData = usersData;
    this.creatorsData = creatorsData;
    this.creatorValidator = creatorValidator;
  }

  /**
   * BecomeCreator use case: add new creator into database
   * @throws ValidationError if invalid parameters are provided or user is already a creator or user does not exist in users database
   * @throws DatabaseError when there is error inserting creator into database
   */
  async becomeCreator({
    userId,
    pageName,
    bio,
    isPlural,
  }: {
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
  }) {
    const user = await this.usersData.fetchUserById(userId);
    if (!user) throw new ValidationError('User with user Id does not exist');
    if (!user.verified) throw new ValidationError('User with userId is not verified');
    if (await this.creatorsData.fetchCreatorById(userId)) throw new ValidationError('User is already a creator');

    const pageNameValidated = this.creatorValidator.validatePageName(pageName);
    const bioValidated = this.creatorValidator.validateBio(bio);

    const creatorAdded = await this.creatorsData.insertNewCreator({
      userId,
      pageName: pageNameValidated,
      bio: bioValidated,
      isPlural,
    });

    return {
      userId,
      pageName: creatorAdded.pageName,
      bio: creatorAdded.bio,
      isPlural: creatorAdded.isPlural,
    };
  }
}
