export interface IUsersData {

  /**
   * Insert new row into Users table
   * @throws DatabaseError if operation fails
   * @returns data of the added user from the database
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
  }): {
    userId: string,
    fullName: string,
    email: string,
  };

  /**
   * Fetch all users in the database
   * @throws DatabaseError if operation fails
   * @returns array of user Data Transfer Objects if users exist, otherwise returns empty array []
   */
  fetchAllUsers(): {
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  }[];

  /**
   * Fetch user information by user Id
   * @throws DatabaseError if operation fails
   * @returns user Data Transfer Object if user id exists, otherwise returns null
   */
  fetchUserById(userId: string): {
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  } | null;

  /**
   * Fetch user information by email Id
   * @throws DatabaseError if operation fails
   * @returns user Data Transfer Object if email Id exists, otherwise returns null
   */
  fetchUserByEmail(email: string): {
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  } | null;

  /**
   * Update user data
   * @throws DatabaseError if operation fails
   * @returns data updated in the database
   */
  updateUser({ userId, fullName }: {
    userId: string,
    fullName?: string,
  }): {
    userId: string,
    fullName?: string,
  };

  /**
   * Update password field, please ensure password is stored in encrypted format
   * @throws DatabaseError if operation fails
   */
  updatePassword(userId: string, newPassword: string): void;
}
