export interface IUsersData {

  /**
   * Insert new row into Users table
   * @throws DatabaseError if operation fails
   * @returns Promise to return data of the added user from the database
   */
  insertNewUser({
    userId,
    fullName,
    email,
    password,
    verified,
  }: {
    userId: string,
    fullName: string,
    email: string,
    password?: string,
    verified: boolean,
  }): Promise<{
    userId: string,
    fullName: string,
    email: string,
  }>;

  /**
   * Fetch user information by user Id
   * @throws DatabaseError if operation fails
   * @returns Promise to return user info if user id exists, otherwise returns null
   */
  fetchUserById(userId: string): Promise<{
    userId: string,
    fullName: string,
    email: string,
    verified: boolean,
  } | null>;

  /**
   * Fetch user in bulk by userId by provided userIds
   * @throws DatabaseError if operation fails
   * @returns Promise to return array of user infos of all userIds for which user info exists
   */
  fetchAllUsersByIds(userIds: string[]): Promise<{
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
    verified: boolean,
  }[]>

  /**
   * Fetch user information by email Id
   * @throws DatabaseError if operation fails
   * @returns Promise to return user info if email Id exists, otherwise returns null
   */
  fetchUserByEmail(email: string): Promise<{
    userId: string,
    fullName: string,
    email: string,
    verified: boolean,
  } | null>;

  /**
   * Update user data
   * @throws DatabaseError if operation fails
   * @returns Promise to return data updated in the database
   */
  updateUser({ userId, fullName, verified }: {
    userId: string,
    fullName?: string,
    verified?: boolean,
  }): Promise<{
    userId: string,
    fullName?: string,
    verified?: boolean,
  }>;

  /**
   * Update password field, please ensure password is provided in encrypted format
   * @throws DatabaseError if operation fails
   */
  updatePassword(userId: string, newPassword: string): Promise<void>;

  /**
   * Fetch user's password hash stored in database to compare with input password.
   * To be used only for login/changing password
   * @throws DatabaseError if operation fails
   */
  fetchPasswordById(userId: string): Promise<string>;
}
