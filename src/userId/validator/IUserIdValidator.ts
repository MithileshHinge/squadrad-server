export interface IUserIdValidator {
  /**
   * Checks if userId is a string, and is 12 byte hex string
   * @throws ValidationError if userId is invalid
   */
  validateUserId(userId: string): string,
}
