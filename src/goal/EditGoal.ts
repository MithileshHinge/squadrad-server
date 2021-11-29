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
    description?: string | null,
    goalNumber?: number,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const goalIdValidated = this.goalValidator.validateGoalId(goalId);
    const titleValidated = title === undefined ? undefined : this.goalValidator.validateTitle(title);
    const goalNumberValidated = goalNumber === undefined ? undefined : this.goalValidator.validateGoalNumber(goalNumber);
    let descriptionValidated: string | null | undefined;
    if (description !== undefined) descriptionValidated = description === null ? null : this.goalValidator.validateDescription(description);

    const goalToUpdate = {
      goalId: goalIdValidated,
      userId: userIdValidated,
      title: titleValidated,
      description: descriptionValidated,
      goalNumber: goalNumberValidated,
    };
    removeUndefinedKeys(goalToUpdate);

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
