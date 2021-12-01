import { validateUserId } from '../userId';
import { ISquadsData } from './ISquadsData';
import { ISquadValidator } from './validator/ISquadValidator';

export default class FindSquad {
  private squadsData: ISquadsData;

  private squadValidator: ISquadValidator;

  constructor(squadsData: ISquadsData, squadValidator: ISquadValidator) {
    this.squadsData = squadsData;
    this.squadValidator = squadValidator;
  }

  /**
   * Gets all squads by a creator's userId
   * @returns Array of squads
   * @throws ValidationError if userId is invalid
   * @throws DatabaseError if operation fails
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

  /**
   * Get squad info by squadId
   * @returns squad info if squad exists, otherwise returns null
   * @throws
   */
  async findSquadById(squadId: string) {
    const squadIdValidated = this.squadValidator.validateSquadId(squadId);

    const squad = await this.squadsData.fetchSquadBySquadId(squadIdValidated);
    if (!squad) return null;
    return {
      squadId: squad.squadId,
      userId: squad.userId,
      title: squad.title,
      amount: squad.amount,
      description: squad.description,
      membersLimit: squad.membersLimit,
    };
  }
}
