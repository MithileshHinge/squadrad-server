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
    description?: string,
    membersLimit?: number,
  }): Promise<{
    squadId: string,
    userId: string,
    title: string,
    amount: number,
    description?: string,
    membersLimit?: number,
  }>;

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
    description?: string,
    membersLimit?: number,
  } | null>;

  updateSquad({
    squadId,
    title,
    description,
    membersLimit,
  }: {
    squadId: string,
    title?: string,
    description?: string,
    membersLimit?: number,
  }): Promise<{
    squadId: string,
    title?: string,
    description?: string,
    membersLimit?: number,
  }>;
}
