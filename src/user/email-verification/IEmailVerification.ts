export interface IEmailVerification {
  sendVerificationMail(to: string): Promise<any>;
}
