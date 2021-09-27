export interface IValidationService {
  validateFullName(fullName: string): string,
  validateEmail(email: string): string,
  validatePassword(password: string): string,
  validateProfilePic(src: string): string,
  minLength(str: string, len: number): boolean,
  maxLength(str: string, len: number): boolean,
  isAlphaAndSpaces(str: string): boolean,
}
