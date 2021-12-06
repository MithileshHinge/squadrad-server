export interface IManualSubValidator {
  validateManualSubId: (manualSubId: string) => string,
  validateContactNumber: (contactNumber: string) => string,
  validateSubscriptionStatus: (subscriptionStatus: number) => number,
}
