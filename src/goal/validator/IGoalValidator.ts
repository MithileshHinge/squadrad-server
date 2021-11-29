export default interface IGoalValidator {
  validateGoalId(goalId: string): string;
  validateTitle(title: string): string;
  validateDescription(description: string): string;
  validateGoalNumber(goalNumber: number): number;
}
