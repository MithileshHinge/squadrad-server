import { validateUserId } from '../userId';
import IGoalsData from './IGoalsData';

export default class FindGoal {
  private goalsData: IGoalsData;

  constructor(goalsData: IGoalsData) {
    this.goalsData = goalsData;
  }

  /**
   * Finds all goals by creator's userId
   * @returns Array of goals
   * @throws ValidationError if params are invalid
   * @throws DatabaseError if operation fails
   */
  async findAllGoalsByUserId(userId: string) {
    const userIdValidated = validateUserId.validate(userId);

    const goals = await this.goalsData.fetchAllGoalsByUserId(userIdValidated);

    return goals.map((goal) => ({
      userId: goal.userId,
      goalId: goal.goalId,
      title: goal.title,
      description: goal.description,
      goalNumber: goal.goalNumber,
    }));
  }
}
