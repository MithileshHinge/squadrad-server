export default interface IGoalsData {
  /**
   * Insert new goal into database
   * @throws DatabaseError
   */
  insertNewGoal({
    goalId,
    userId,
    title,
    description,
    goalNumber,
  }: {
    goalId: string,
    userId: string,
    title: string,
    description: string,
    goalNumber: number,
  }): Promise<{
    goalId: string,
    userId: string,
    title: string,
    description: string,
    goalNumber: number,
  }>;

  /**
   * Fetch goal by userId and goalNumber
   * @returns goal info if goal found, otherwise returns null
   * @throws DatabaseError
   */
  fetchGoalByGoalNumber({
    userId,
    goalNumber,
  }: {
    userId: string,
    goalNumber: number,
  }): Promise<{
    goalId: string,
    userId: string,
    title: string,
    description: string,
    goalNumber: number,
  } | null>;

  /**
   * Fetch all goals by userId
   * @returns Array of goals
   * @throws DatabaseError
   */
  fetchAllGoalsByUserId(userId: string): Promise<{
    goalId: string,
    userId: string,
    title: string,
    description: string,
    goalNumber: number,
  }[]>;

  /**
   * Update goal info
   * @throws DatabaseError
   */
  updateGoal({
    userId,
    goalId,
    title,
    description,
    goalNumber,
  }: {
    userId: string,
    goalId: string,
    title?: string,
    description?: string,
    goalNumber?: number,
  }): Promise<{
    userId: string,
    goalId: string,
    title?: string,
    description?: string,
    goalNumber?: number,
  }>;
}
