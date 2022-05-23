import { validateUserId } from '../userId';
import { ICreatorsData } from './ICreatorsData';

export default class FindCreator {
  private creatorsData: ICreatorsData;

  constructor(creatorsData: ICreatorsData) {
    this.creatorsData = creatorsData;
  }

  /**
   * Finds creator by userId, returns entire page info, includes private information if self is true
   * @returns Promise to return page info if id exists, otherwise returns null
   * @throws ValidationError if userId is not a 12 byte hex string
   * @throws DatabaseError if operation fails
   */
  async findCreatorPage(userId: string, self?: boolean): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    profilePicSrc: string,
    showTotalSquadMembers?: boolean,
    about: string,
    goalsTypeEarnings: Boolean,
  } | null> {
    const userIdValidated = validateUserId.validate(userId);
    const creatorInfo = await this.creatorsData.fetchCreatorById(userIdValidated);

    if (!creatorInfo) return null;

    return {
      userId: creatorInfo.userId,
      pageName: creatorInfo.pageName,
      bio: creatorInfo.bio,
      isPlural: creatorInfo.isPlural,
      profilePicSrc: creatorInfo.profilePicSrc,
      ...(self && { showTotalSquadMembers: creatorInfo.showTotalSquadMembers }),
      about: creatorInfo.about,
      goalsTypeEarnings: creatorInfo.goalsTypeEarnings,
    };
  }
}
