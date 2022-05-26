import FindCreator from '../creator/FindCreator';
import { validateUserId } from '../userId';
import FindManualSub from './FindManualSub';
import { IManualSubsData } from './IManualSubsData';
import ManualSubStatuses from './ManualSubStatuses';

export default class FindManualSubbedCreators {
  private findManualSub: FindManualSub;

  private findCreator: FindCreator;

  private manualSubsData: IManualSubsData;

  constructor(findManualSub: FindManualSub, findCreator: FindCreator, manualSubsData: IManualSubsData) {
    this.findManualSub = findManualSub;
    this.findCreator = findCreator;
    this.manualSubsData = manualSubsData;
  }

  /**
   * Finds info of all creators the user is a member of
   * @userId id of user requesting list of creators
   */
  async find({ userId, onlyActive }: { userId: string, onlyActive: boolean }) {
    const userIdValidated = validateUserId.validate(userId);

    let manualSubs = await this.findManualSub.findManualSubsByUserId(userIdValidated);
    if (onlyActive) manualSubs = manualSubs.filter((manualSub) => manualSub.subscriptionStatus === ManualSubStatuses.ACTIVE);
    const creatorIdsList = manualSubs.map((manualSub) => (manualSub.creatorUserId));
    const creatorInfosList = await this.findCreator.findCreatorInfos(creatorIdsList);

    return creatorInfosList.map((creatorInfo) => ({
      userId: creatorInfo.userId,
      pageName: creatorInfo.pageName,
      profilePicSrc: creatorInfo.profilePicSrc,
    }));
  }
}
