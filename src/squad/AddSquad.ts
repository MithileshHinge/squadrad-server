import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import { validateUserId } from '../userId';
import { ISquadsData } from './ISquadsData';
import { ISquadValidator } from './validator/ISquadValidator';

export default class AddSquad {
  private squadsData: ISquadsData;

  private squadValidator: ISquadValidator;

  constructor(squadsData: ISquadsData, squadValidator: ISquadValidator) {
    this.squadsData = squadsData;
    this.squadValidator = squadValidator;
  }

  /**
   * AddSquad use case: add a new squad to database
   * @throws ValidationError if another squad with same amount already exists, or if params are invalid
   * @throws DatabaseError if database operations fail
   */
  async add({
    userId,
    title,
    amount,
    description,
    membersLimit,
  }: {
    userId: string,
    title: string,
    amount: number,
    description?: string,
    membersLimit?: number,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const titleValidated = this.squadValidator.validateTitle(title);
    const amountValidated = this.squadValidator.validateAmount(amount);
    const descriptionValidated = description === undefined ? undefined : this.squadValidator.validateDescription(description);
    const membersLimitValidated = membersLimit === undefined ? undefined : this.squadValidator.validateLimit(membersLimit);

    const existingSquad = await this.squadsData.fetchSquadByAmount({ userId: userIdValidated, amount: amountValidated });
    if (existingSquad) throw new ValidationError('Another Squad with the same amount already exists');

    const squadId = id.createId();
    const squadAdded = await this.squadsData.insertNewSquad({
      squadId,
      userId: userIdValidated,
      title: titleValidated,
      amount: amountValidated,
      description: descriptionValidated,
      membersLimit: membersLimitValidated,
    });

    return {
      squadId: squadAdded.squadId,
      userId: squadAdded.userId,
      title: squadAdded.title,
      amount: squadAdded.amount,
      description: squadAdded.description,
      membersLimit: squadAdded.membersLimit,
    };
  }
}
