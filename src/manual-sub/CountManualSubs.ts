import { validateUserId } from '../userId';
import { IManualSubsData } from './IManualSubsData';

export default class CountManualSubs {
  private manualSubsData: IManualSubsData;

  constructor(manualSubsData: IManualSubsData) {
    this.manualSubsData = manualSubsData;
  }

  /**
   * Count total active members of a creator
   * @returns total members, default 0
   */
  async countTotalMembersByCreatorId(creatorUserId: string) {
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);

    const totalMembers = await this.manualSubsData.countManualSubsByCreatorUserId(creatorUserIdValidated);

    return totalMembers;
  }

  /**
   * Calculate total monthly income from active manualSubs of a creator
   * @returns sum of amounts of manualSubs, default 0
   */
  async countMonthlyIncomeByCreatorId(creatorUserId: string) {
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);

    const monthlyIncome = await this.manualSubsData.sumAmountsByCreatorUserId(creatorUserIdValidated);

    return monthlyIncome;
  }
}
