import ValidationError from '../common/errors/ValidationError';
import id from '../common/id';
import { validateUserId } from '../userId';
import IGoalsData from './IGoalsData';
import IGoalValidator from './validator/IGoalValidator';

export default class AddGoal {
  private goalsData: IGoalsData;

  private goalValidator: IGoalValidator;

  constructor(goalsData: IGoalsData, goalValidator: IGoalValidator) {
    this.goalsData = goalsData;
    this.goalValidator = goalValidator;
  }

  /**
   * AddGoal use case: add a new goal
   * @throws ValidationError if another goal with same number already exists, or if params are invalid
   * @throws DatabaseError if database operation fails
   */
  async add({
    userId, title, description, goalNumber,
  }: {
    userId: string,
    title: string,
    description?: string,
    goalNumber: number,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const titleValidated = this.goalValidator.validateTitle(title);
    const descriptionValidated = description === undefined ? undefined : this.goalValidator.validateDescription(description);
    const goalNumberValidated = this.goalValidator.validateGoalNumber(goalNumber);

    if (await this.goalsData.fetchGoalByGoalNumber({ userId: userIdValidated, goalNumber: goalNumberValidated })) {
      throw new ValidationError('Another goal for same goal number already exisits');
    }

    const goalId = id.createId();

    const goalAdded = await this.goalsData.insertNewGoal({
      goalId,
      userId: userIdValidated,
      title: titleValidated,
      description: descriptionValidated,
      goalNumber: goalNumberValidated,
    });

    return {
      goalId: goalAdded.goalId,
      userId: goalAdded.userId,
      title: goalAdded.title,
      description: goalAdded.description,
      goalNumber: goalAdded.goalNumber,
    };
  }
}
