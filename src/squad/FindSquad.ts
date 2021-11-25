import { validateUserId } from '../userId';
import { ISquadsData } from './ISquadsData';

export default class FindSquad {
  private squadsData: ISquadsData;

  constructor(squadsData: ISquadsData) {
    this.squadsData = squadsData;
  }

  /**
   * Gets all squads by a creator's userId
   * @returns Array of squads
   */
  async findAllSquadsByUserId(userId: string) {
    const userIdValidated = validateUserId.validate(userId);

    const squads = await this.squadsData.fetchAllSquadsByUserId(userIdValidated);

    return squads.map((squad) => ({
      userId: squad.userId,
      squadId: squad.squadId,
      title: squad.title,
      amount: squad.amount,
      description: squad.description,
      membersLimit: squad.membersLimit,
    }));
  }
}
