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

  /**
   * Finds all creators by provided userIds, returns list of basic info: userId, pageName, profilePicSrc
   * @param userIds Array of userIds for which creator infos should be returned
   * @returns Promise to return array of basic creator info
   */
  async findCreatorInfos(userIds: string[]) {
    const userIdsValidated = userIds.map((userId) => validateUserId.validate(userId));

    const creatorInfos = await this.creatorsData.fetchAllCreatorsByIds(userIdsValidated);

    return creatorInfos.map((creator) => ({
      userId: creator.userId,
      pageName: creator.pageName,
      profilePicSrc: creator.profilePicSrc,
    }));
  }
}
