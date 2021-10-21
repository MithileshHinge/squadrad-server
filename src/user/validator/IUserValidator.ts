export interface IUserValidator {
  validateUserId(userId: string): string,
  validateFullName(fullName: string): string,
  validateEmail(email: string): string,
  validatePassword(password: string): string,
  validateToken(token: string): string,
}
