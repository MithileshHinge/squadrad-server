import { validateUserId } from '../userId';
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

  /**
   * Find manualSub by userId and creatorUserId
   * @returns manualSub info if found, otherwise returns null,
   */
  async findManualSubByUserIds(userId: string, creatorUserId: string) {
    const userIdValidated = validateUserId.validate(userId);
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);

    const manualSub = await this.manualSubsData.fetchManualSubByUserIds(userIdValidated, creatorUserIdValidated);
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

  /**
   * Find manualSubs of a user to all creators
   * @returns Array of manualSubs of a user, empty array [] if no manualSubs found
   */
  async findManualSubsByUserId(userId: string) {
    const userIdValidated = validateUserId.validate(userId);
    const manualSubs = await this.manualSubsData.fetchManualSubsByUserId(userIdValidated);

    return manualSubs.map((manualSub) => ({
      manualSubId: manualSub.manualSubId,
      userId: manualSub.userId,
      creatorUserId: manualSub.creatorUserId,
      squadId: manualSub.squadId,
      amount: manualSub.amount,
      subscriptionStatus: manualSub.subscriptionStatus,
    }));
  }

  /**
   * Find manualSubs of all users to a creator
   * @returns Array of manualSubs of a creator, empty array [] if no manualSubs found
   */
  async findManualSubsByCreatorUserId(userId: string) {
    const userIdValidated = validateUserId.validate(userId);
    const manualSubs = await this.manualSubsData.fetchManualSubsByCreatorUserId(userIdValidated);

    return manualSubs.map((manualSub) => ({
      manualSubId: manualSub.manualSubId,
      userId: manualSub.userId,
      creatorUserId: manualSub.creatorUserId,
      squadId: manualSub.squadId,
      amount: manualSub.amount,
      subscriptionStatus: manualSub.subscriptionStatus,
    }));
  }
}
