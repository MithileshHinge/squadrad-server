export interface ICreatorValidator {
  validatePageName(pageName: string): string;
  validateBio(bio: string): string;
  validateIsPlural(isPlural: boolean): boolean;
  validateShowTotalSquadMembers(showTotalSquadMembers: boolean): boolean;
  validateAbout(about: string): string;
  validateGoalsTypeEarnings(goalsTypeEarnings: Boolean): Boolean;
}
