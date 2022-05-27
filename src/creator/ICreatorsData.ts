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
    goalsTypeEarnings,
  }: {
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
    goalsTypeEarnings: boolean,
  }): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
    goalsTypeEarnings: boolean,
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
    goalsTypeEarnings: boolean,
    profilePicSrc: string,
  } | null>

  /**
   * Fetch list of creators by provided array of userIds
   * @throws DatabaseError if operation fails
   * @returns Promise to return array of creator infos of all userIds for which creator info exists
   */
  fetchAllCreatorsByIds(userIds: string[]): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
    goalsTypeEarnings: boolean,
    profilePicSrc: string,
  }[]>

  /**
   * Fetch list of all creators
   * @throws DatabaseError if operation fails
   * @returns Promise to return array of creator infos of all creators
   */
  fetchAllCreators(): Promise<{
    userId: string,
    pageName: string,
    bio: string,
    isPlural: boolean,
    showTotalSquadMembers: boolean,
    about: string,
    goalsTypeEarnings: boolean,
    profilePicSrc: string,
  }[]>

  /**
   * Update creator information
   * @throws DatabaseError if operation fails
   * @returns Promise to return data updated in the database
   */
  updateCreator({
    userId, pageName, bio, isPlural, showTotalSquadMembers, about,
  } : {
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
    showTotalSquadMembers?: boolean,
    about?: string,
    goalsTypeEarnings?: boolean,
  }): Promise<{
    userId: string,
    pageName?: string,
    bio?: string,
    isPlural?: boolean,
    showTotalSquadMembers?: boolean,
    about?: string,
    goalsTypeEarnings?: boolean,
  }>
}
