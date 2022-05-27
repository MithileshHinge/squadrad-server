import FindUser from '../user/FindUser';
import { validateUserId } from '../userId';
import FindManualSub from './FindManualSub';
import { IManualSubsData } from './IManualSubsData';
import ManualSubStatuses from './ManualSubStatuses';

export default class FindManualSubbedUsers {
  private findManualSub: FindManualSub;

  private findUser: FindUser;

  private manualSubsData: IManualSubsData;

  constructor(findManualSub: FindManualSub, findUser: FindUser, manualSubsData: IManualSubsData) {
    this.findManualSub = findManualSub;
    this.findUser = findUser;
    this.manualSubsData = manualSubsData;
  }

  /**
   * Finds info of all users who are member of a creator
   * @userId id of creator requesting list of users
   */
  async find({ userId, onlyActive }: { userId: string, onlyActive: boolean }) {
    const userIdValidated = validateUserId.validate(userId);

    let manualSubs = await this.findManualSub.findManualSubsByCreatorUserId(userIdValidated);
    if (onlyActive) manualSubs = manualSubs.filter((manualSub) => manualSub.subscriptionStatus === ManualSubStatuses.ACTIVE);
    const userIdsList = manualSubs.map((manualSub) => (manualSub.userId));
    const userInfosList = await this.findUser.findUserInfos({ userIds: userIdsList, onlyVerified: true });

    return userInfosList.map((userInfo) => ({
      userId: userInfo.userId,
      fullName: userInfo.fullName,
      profilePicSrc: userInfo.profilePicSrc,
    }));
  }
}
