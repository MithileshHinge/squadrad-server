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
    description: string | null,
    goalNumber: number,
  }): Promise<{
    goalId: string,
    userId: string,
    title: string,
    description: string | null,
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
    description: string | null,
    goalNumber: number,
  }>;
}
