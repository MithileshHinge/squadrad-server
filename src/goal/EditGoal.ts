import ValidationError from '../common/errors/ValidationError';
import { removeUndefinedKeys } from '../common/helpers';
import { validateUserId } from '../userId';
import IGoalsData from './IGoalsData';
import IGoalValidator from './validator/IGoalValidator';

export default class EditGoal {
  private goalsData: IGoalsData;

  private goalValidator: IGoalValidator;

  constructor(goalsData: IGoalsData, goalValidator: IGoalValidator) {
    this.goalsData = goalsData;
    this.goalValidator = goalValidator;
  }

  /**
   * EditGoal use case: edit goal info, allowed fields: title, description, goalNumber
   * @throws ValidationError if goal of same goal number already exists, or if params are invalid
   * @throws DatabaseError if database operation fails
   */
  async edit({
    userId, goalId, title, description, goalNumber,
  }: {
    userId: string,
    goalId: string,
    title?: string,
    description?: string,
    goalNumber?: number,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const goalIdValidated = this.goalValidator.validateGoalId(goalId);
    const titleValidated = title === undefined ? undefined : this.goalValidator.validateTitle(title);
    const descriptionValidated = description === undefined ? undefined : this.goalValidator.validateDescription(description);
    const goalNumberValidated = goalNumber === undefined ? undefined : this.goalValidator.validateGoalNumber(goalNumber);

    const goalToUpdate = {
      goalId: goalIdValidated,
      userId: userIdValidated,
      title: titleValidated,
      description: descriptionValidated,
      goalNumber: goalNumberValidated,
    };
    removeUndefinedKeys(goalToUpdate);

    if (Object.keys(goalToUpdate).length <= 2) throw new ValidationError('Nothing to update');
    const goalUpdated = await this.goalsData.updateGoal(goalToUpdate);

    return {
      goalId: goalUpdated.goalId,
      userId: goalUpdated.userId,
      title: goalUpdated.title,
      description: goalUpdated.description,
      goalNumber: goalUpdated.goalNumber,
    };
  }
}
