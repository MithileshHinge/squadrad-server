export interface ISquadsData {
  /**
   * Inserts new squad into database
   * @throws DatabaseError if operation fails
   */
  insertNewSquad({
    squadId,
    userId,
    title,
    amount,
    description,
    membersLimit,
  }: {
    squadId: string,
    userId: string,
    title: string,
    amount: number,
    description: string,
    membersLimit: number,
  }): Promise<{
    squadId: string,
    userId: string,
    title: string,
    amount: number,
    description: string,
    membersLimit: number,
  }>;

  /**
   * Fetch squad info by squadId
   * @returns Squad info if squad exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchSquadBySquadId(squadId: string): Promise<{
    userId: string,
    squadId: string,
    title: string,
    amount: number,
    description: string,
    membersLimit: number,
  } | null>;

  /**
   * Fetch squad info by userId and amount
   * @returns Squad info if squad exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchSquadByAmount({
    userId,
    amount,
  }: {
    userId: string,
    amount: number,
  }): Promise<{
    userId: string,
    squadId: string,
    title: string,
    amount: number,
    description: string,
    membersLimit: number,
  } | null>;

  /**
   * Fetch all squads by userId
   * @returns Array of squad info, returns empty array if no squads of given userId found
   * @throws DatabaseError if operation fails
   */
  fetchAllSquadsByUserId(userId: string): Promise<{
    userId: string,
    squadId: string,
    title: string,
    amount: number,
    description: string,
    membersLimit: number,
  }[]>

  /**
   * Update squad info in the database
   * @throws DatabaseError if operation fails
   */
  updateSquad({
    userId,
    squadId,
    title,
    description,
    membersLimit,
  }: {
    userId: string,
    squadId: string,
    title?: string,
    description?: string,
    membersLimit?: number,
  }): Promise<{
    userId: string,
    squadId: string,
    title?: string,
    description?: string,
    membersLimit?: number,
  }>;
}
