export interface IEmailVerification {
  /**
   * Send email with verification link that contains a JWT to verify email address
   * @param to email address of user
   * @throws MailError if mail couldn't be sent
   */
  sendVerificationMail(to: string): Promise<any>;

  /**
   * Verify JWT from verification link
   * @param token JWT token string
   * @returns JWT data
   * @throws JWTError if JWT is expired or invalid
   */
  verifyEmailToken(token: string): Promise<{ email: string }>;
}
