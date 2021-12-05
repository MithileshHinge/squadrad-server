import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import FindSquad from '../squad/FindSquad';
import { validateUserId } from '../userId';
import { IManualSubsData } from './IManualSubsData';
import ManualSubStatuses from './ManualSubStatuses';

export default class AddManualSub {
  private manualSubsData: IManualSubsData;

  private findSquad: FindSquad;

  constructor(manualSubsData: IManualSubsData, findSquad: FindSquad) {
    this.manualSubsData = manualSubsData;
    this.findSquad = findSquad;
  }

  /**
   * Creates a new manual subscription between a user and a creator
   * @throws ValidationError if squad does not exist or params are invalid
   * @throws DatabaseError if operation fails
   */
  async add({
    userId, squadId,
  }: {
    userId: string,
    squadId: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const squad = await this.findSquad.findSquadById(squadId);

    if (!squad) throw new ValidationError('Squad does not exist');

    const manualSubId = id.createId();

    this.manualSubsData.insertNewManualSub({
      manualSubId,
      userId: userIdValidated,
      creatorUserId: squad.userId,
      squadId: squad.squadId,
      amount: squad.amount,
      contactNumber: '',
      subscriptionStatus: ManualSubStatuses.CREATED,
    });

    return {
      manualSubId,
      userId: userIdValidated,
      squadId: squad.squadId,
      amount: squad.amount,
    };
  }
}
