export default interface IGoalValidator {
  validateTitle(title: string): string;
  validateDescription(description: string): string;
  validateGoalNumber(goalNumber: number): number;
}
