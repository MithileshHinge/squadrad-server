import { validateUserId } from '../userId';
import { IManualSubsData } from './IManualSubsData';
import ManualSubStatuses from './ManualSubStatuses';
import { IManualSubValidator } from './validator/IManualSubValidator';

export default class CancelManualSub {
  private manualSubsData: IManualSubsData;

  private manualSubValidator: IManualSubValidator;

  constructor(manualSubsData: IManualSubsData, manualSubValidator: IManualSubValidator) {
    this.manualSubsData = manualSubsData;
    this.manualSubValidator = manualSubValidator;
  }

  /**
   * Cancel a manual subscription
   */
  async cancelById({ userId, creatorUserId }: { userId: string, creatorUserId: string }) {
    const userIdValidated = validateUserId.validate(userId);
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);

    await this.manualSubsData.updateManualSub({ userId: userIdValidated, creatorUserId: creatorUserIdValidated }, { subscriptionStatus: ManualSubStatuses.CANCELLED });
  }
}
