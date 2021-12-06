import id from '../common/id';
import { ISquadValidator } from '../squad/validator/ISquadValidator';
import { validateUserId } from '../userId';
import { IManualSubsData } from './IManualSubsData';
import ManualSubStatuses from './ManualSubStatuses';
import { IManualSubValidator } from './validator/IManualSubValidator';

export default class AddManualSub {
  private manualSubsData: IManualSubsData;

  private manualSubValidator: IManualSubValidator;

  private squadValidator: ISquadValidator;

  constructor(manualSubsData: IManualSubsData, manualSubValidator: IManualSubValidator, squadValidator: ISquadValidator) {
    this.manualSubsData = manualSubsData;
    this.manualSubValidator = manualSubValidator;
    this.squadValidator = squadValidator;
  }

  /**
   * Adds a new manual subscription record, does NOT check if squad/creator exists
   * @throws ValidationError if params are invalid
   * @throws DatabaseError if operation fails
   */
  async add({
    userId, creatorUserId, squadId, amount, contactNumber = '', subscriptionStatus = ManualSubStatuses.CREATED,
  }: {
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);
    const squadIdValidated = this.squadValidator.validateSquadId(squadId);
    const amountValidated = this.squadValidator.validateAmount(amount);
    const contactNumberValidated = this.manualSubValidator.validateContactNumber(contactNumber);
    const subscriptionStatusValidated = this.manualSubValidator.validateSubscriptionStatus(subscriptionStatus);

    const manualSubId = id.createId();

    this.manualSubsData.insertNewManualSub({
      manualSubId,
      userId: userIdValidated,
      creatorUserId: creatorUserIdValidated,
      squadId: squadIdValidated,
      amount: amountValidated,
      contactNumber: contactNumberValidated,
      subscriptionStatus: subscriptionStatusValidated,
    });

    return {
      manualSubId,
      userId: userIdValidated,
      squadId: squadIdValidated,
      amount: amountValidated,
    };
  }
}
