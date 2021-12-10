export interface IPostValidator {
  validateTitle: (title: string) => string,
  validateDescription: (description: string) => string,
}
