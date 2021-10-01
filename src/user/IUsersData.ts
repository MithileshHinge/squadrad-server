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
  }: {
    userId: string,
    fullName: string,
    email: string,
    password: string
  }): Promise<{
    userId: string,
    fullName: string,
    email: string,
  }>;

  /**
   * Fetch all users in the database
   * @throws DatabaseError if operation fails
   * @returns Promise to return array of user info if users exist, otherwise returns empty array []
   */
  fetchAllUsers(): Promise<{
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  }[]>;

  /**
   * Fetch user information by user Id
   * @throws DatabaseError if operation fails
   * @returns Promise to return user info if user id exists, otherwise returns null
   */
  fetchUserById(userId: string): Promise<{
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  } | null>;

  /**
   * Fetch user information by email Id
   * @throws DatabaseError if operation fails
   * @returns Promise to return user info if email Id exists, otherwise returns null
   */
  fetchUserByEmail(email: string): Promise<{
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  } | null>;

  /**
   * Update user data
   * @throws DatabaseError if operation fails
   * @returns Promise to return data updated in the database
   */
  updateUser({ userId, fullName }: {
    userId: string,
    fullName?: string,
  }): Promise<{
    userId: string,
    fullName?: string,
  }>;

  /**
   * Update password field, please ensure password is provided in encrypted format
   * @throws DatabaseError if operation fails
   */
  updatePassword(userId: string, newPassword: string): Promise<void>;
}
