export interface IManualSubsData {
  /**
   * Insert a new manual subscription record
   * @throws DatabaseError if operation fails
   */
  insertNewManualSub({
    manualSubId, userId, creatorUserId, squadId, amount, contactNumber, subscriptionStatus,
  }: {
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number, // 0-created, 1-active, 2-paymentPending
  }): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  }>;
}
