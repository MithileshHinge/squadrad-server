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

  /**
   * Fetch manualSub by manualSubId
   * @returns manualSub if found, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchManualSubById(manualSubId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  } | null>;

  /**
   * Fetch manualSub by userId and creatorUserId
   * @returns manualSub if found, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchManualSubByUserIds(userId: string, creatorUserId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  } | null>;
}
