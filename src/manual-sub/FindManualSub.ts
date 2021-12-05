import { IManualSubsData } from './IManualSubsData';
import { IManualSubValidator } from './validator/IManualSubValidator';

export default class FindManualSub {
  private manualSubsData: IManualSubsData;

  private manualSubValidator: IManualSubValidator;

  constructor(manualSubsData: IManualSubsData, manualSubValidator: IManualSubValidator) {
    this.manualSubsData = manualSubsData;
    this.manualSubValidator = manualSubValidator;
  }

  /**
   * FindManualSubById use case
   * @returns manualSub info if manualSub found, otherwise returns null
   * @throws ValidationError if params are invalid
   * @throws DatabaseError if operation fails
   */
  async findManualSubById(manualSubId: string) {
    const manualSubIdValidated = this.manualSubValidator.validateManualSubId(manualSubId);

    const manualSub = await this.manualSubsData.fetchManualSubById(manualSubIdValidated);
    if (!manualSub) return null;

    return {
      manualSubId: manualSub.manualSubId,
      userId: manualSub.userId,
      creatorUserId: manualSub.creatorUserId,
      squadId: manualSub.squadId,
      amount: manualSub.amount,
      subscriptionStatus: manualSub.subscriptionStatus,
    };
  }
}
