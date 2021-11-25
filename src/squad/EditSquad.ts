import { validateUserId } from '../userId';
import { ISquadsData } from './ISquadsData';
import { ISquadValidator } from './validator/ISquadValidator';

export default class EditSquad {
  private squadsData: ISquadsData;

  private squadValidator: ISquadValidator;

  constructor(squadsData: ISquadsData, squadValidator: ISquadValidator) {
    this.squadsData = squadsData;
    this.squadValidator = squadValidator;
  }

  /**
   * Edit Squad info: only title, description, and membersLimit allowed
   * @throws ValidationError if params are invalid
   * @throws DatabaseError if database operations fail
   */
  async edit({
    userId,
    squadId,
    title,
    description,
    membersLimit,
  }: {
    userId: string,
    squadId: string,
    title?: string,
    description?: string,
    membersLimit?: number,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const squadIdValidated = this.squadValidator.validateSquadId(squadId);
    const titleValidated = title === undefined ? undefined : this.squadValidator.validateTitle(title);
    const descriptionValidated = description === undefined ? undefined : this.squadValidator.validateDescription(description);
    const membersLimitValidated = membersLimit === undefined ? undefined : this.squadValidator.validateLimit(membersLimit);

    const squadToUpdate = {
      userId: userIdValidated,
      squadId: squadIdValidated,
      title: titleValidated,
      description: descriptionValidated,
      membersLimit: membersLimitValidated,
    };

    const squadEdited = await this.squadsData.updateSquad(squadToUpdate);

    return {
      userId: squadEdited.userId,
      squadId: squadEdited.squadId,
      title: squadEdited.title,
      description: squadEdited.description,
      membersLimit: squadEdited.membersLimit,
    };
  }
}
