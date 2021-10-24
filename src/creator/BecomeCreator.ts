import ValidationError from '../common/errors/ValidationError';
import SetProfilePic from '../profile-pic/SetProfilePic';
import { IUsersData } from '../user/IUsersData';
import { validateUserId } from '../userId';
import { ICreatorsData } from './ICreatorsData';
import { ICreatorValidator } from './validator/ICreatorValidator';

export default class BecomeCreator {
  private usersData: IUsersData;

  private creatorsData: ICreatorsData;

  private creatorValidator: ICreatorValidator;

  private setProfilePic: SetProfilePic;

  constructor(usersData: IUsersData, creatorsData: ICreatorsData, creatorValidator: ICreatorValidator, setProfilePic: SetProfilePic) {
    this.usersData = usersData;
    this.creatorsData = creatorsData;
    this.creatorValidator = creatorValidator;
    this.setProfilePic = setProfilePic;
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
    const userIdValidated = validateUserId.validate(userId);
    const user = await this.usersData.fetchUserById(userIdValidated);
    if (!user) throw new ValidationError('User with user Id does not exist');
    if (!user.verified) throw new ValidationError('User with userId is not verified');
    if (await this.creatorsData.fetchCreatorById(userIdValidated)) throw new ValidationError('User is already a creator');

    const pageNameValidated = this.creatorValidator.validatePageName(pageName);
    const bioValidated = this.creatorValidator.validateBio(bio);
    const isPluralValidated = this.creatorValidator.validateIsPlural(isPlural);

    const creatorAdded = await this.creatorsData.insertNewCreator({
      userId: userIdValidated,
      pageName: pageNameValidated,
      bio: bioValidated,
      isPlural: isPluralValidated,
      showTotalSquadMembers: false,
      about: '',
    });

    const profilePicSrc = await this.setProfilePic.setDefault(userIdValidated, true);

    return {
      userId: creatorAdded.userId,
      pageName: creatorAdded.pageName,
      bio: creatorAdded.bio,
      isPlural: creatorAdded.isPlural,
      profilePicSrc,
    };
  }
}
