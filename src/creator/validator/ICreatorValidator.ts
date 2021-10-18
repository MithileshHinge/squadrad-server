export interface ICreatorValidator {
  validatePageName(pageName: string): string;
  validateBio(bio: string): string,
}
