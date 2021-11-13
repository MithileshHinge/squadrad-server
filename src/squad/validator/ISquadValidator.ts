export interface ISquadValidator {
  validateSquadId(squadId: string): string;
  validateTitle(title: string): string;
  validateAmount(amount: number): number;
  validateDescription(description: string): string;
  validateLimit(membersLimit: number): number;
}
