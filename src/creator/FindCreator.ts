import { validateUserId } from '../userId';
import { ICreatorsData } from './ICreatorsData';
import ReviewPageStatus from './ReviewPageStatus';

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
    goalsTypeEarnings: boolean,
    review?: { status: ReviewPageStatus, rejectionReason?: string },
  } | null> {
    const userIdValidated = validateUserId.validate(userId);
    const creatorInfo = await this.creatorsData.fetchCreatorById(userIdValidated);

    if (!creatorInfo) return null;
    if (!self && creatorInfo.review.status !== ReviewPageStatus.APPROVED) return null;

    return {
      userId: creatorInfo.userId,
      pageName: creatorInfo.pageName,
      bio: creatorInfo.bio,
      isPlural: creatorInfo.isPlural,
      profilePicSrc: creatorInfo.profilePicSrc,
      ...(self && { showTotalSquadMembers: creatorInfo.showTotalSquadMembers }),
      about: creatorInfo.about,
      goalsTypeEarnings: creatorInfo.goalsTypeEarnings,
      ...(self && { review: creatorInfo.review }),
    };
  }

  /**
   * Finds all creators by provided userIds, returns list of basic info: userId, pageName, profilePicSrc
   * @param userIds Array of userIds for which creator infos should be returned
   * @returns Promise to return array of basic creator info
   */
  async findCreatorInfos(userIds: string[]) {
    const userIdsValidated = userIds.map((userId) => validateUserId.validate(userId));

    let creatorInfos = await this.creatorsData.fetchAllCreatorsByIds(userIdsValidated);
    creatorInfos = creatorInfos.filter((creatorInfo) => creatorInfo.review.status === ReviewPageStatus.APPROVED);

    return creatorInfos.map((creator) => ({
      userId: creator.userId,
      pageName: creator.pageName,
      profilePicSrc: creator.profilePicSrc,
    }));
  }

  /**
   * Finds all creators info
   * @returns Promise to return array of basic creator info: userId, pageName, profilePicSrc, bio
   */
  async findAllCreatorsInfos() {
    let creatorInfos = await this.creatorsData.fetchAllCreators();
    creatorInfos = creatorInfos.filter((creatorInfo) => creatorInfo.review.status === ReviewPageStatus.APPROVED);

    return creatorInfos.map((creator) => ({
      userId: creator.userId,
      pageName: creator.pageName,
      profilePicSrc: creator.profilePicSrc,
      bio: creator.bio,
    }));
  }
}
