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
   * Fetch the ACTIVE manualSub of userId to creatorUserId
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

  /**
   * Fetch manualSubs by userId
   * @param userId
   */
  fetchManualSubsByUserId(userId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  }[]>

  /**
   * Fetch manualSubs by creatorUserId
   * @param creatorUserId creatorUserId
   */
  fetchManualSubsByCreatorUserId(creatorUserId: string): Promise<{
    manualSubId: string,
    userId: string,
    creatorUserId: string,
    squadId: string,
    amount: number,
    contactNumber: string,
    subscriptionStatus: number,
  }[]>

  /**
   * Count total active manualSubs of a creatorUserId
   * @returns total number, default 0
   * @throws DatabaseError if operation fails
   */
  countManualSubsByCreatorUserId(creatorUserId: string): Promise<Number>;

  /**
   * Count total amount of active manualSubs of a creatorUserId
   * @returns sum of amounts, default 0
   * @throws DatabaseError if operation fails
   */
  sumAmountsByCreatorUserId(creatorUserId: string): Promise<Number>;

  /**
   * Update manual sub of userId to creatorUserId
   */
  updateManualSub(
    filter: {
      userId: string,
      creatorUserId: string,
    },
    updateData : {
      squadId?: string,
      amount?: number,
      contactNumber?: string,
      subscriptionStatus?: number,
    },
  ): Promise<null>;
}
