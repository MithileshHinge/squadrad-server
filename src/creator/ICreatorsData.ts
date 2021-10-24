export interface ICreatorsData {
  /**
   * Insert new creator into database
   * @throws DatabaseError if operation fails
   */
  insertNewCreator({
    userId,
    pageName,
    bio,
    isPlural,
    showTotalSquadMembers,
    about,
  }: {
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
  }): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
  }>

  /**
   * Fetch creator information by user Id
   * @throws DatabaseError if operation fails
   * @returns Promise to return creator info if user id exists, otherwise returns null
   */
  fetchCreatorById(userId: string): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
  } | null>

  /**
   * Update creator information
   * @throws DatabaseError if operation fails
   * @returns Promise to return data updated in the database
   */
  updateCreator({
    userId, pageName, bio, isPlural, about,
  } : {
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
    showTotalSquadMembers?: boolean,
    about?: string,
  }): Promise<{
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
    showTotalSquadMembers?: boolean,
    about?: string,
  }>
}
