export interface IProfilePicsData {
  /**
   * Update profile pic path to new path
   * @throws DatabaseErrors if operation fails
   */
  updateProfilePic(userId: string, src: string): void;

  /**
      * Fetch profile picture's path stored in database
      * @returns string src if user exists, otherwise returns null
      * @throws DatabaseError if operation fails
      */
  fetchProfilePic(userId: string): string | null;
}
