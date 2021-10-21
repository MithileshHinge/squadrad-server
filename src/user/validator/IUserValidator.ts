export interface IUserValidator {
  validateFullName(fullName: string): string,
  validateEmail(email: string): string,
  validatePassword(password: string): string,
  validateToken(token: string): string,
}
