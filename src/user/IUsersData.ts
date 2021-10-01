export interface IUsersData {

  /**
   * Insert new row into Users table
   * @returns data of the added user from the database
   * @throws DatabaseError if operation fails
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
   * @returns array of user Data Transfer Objects if users exist, otherwise returns empty array []
   * @throws DatabaseError if operation fails
   */
  fetchAllUsers(): {
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  }[];

  /**
   * Fetch user information by user Id
   * @returns user Data Transfer Object if user id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchUserById(userId: string): {
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  } | null;

  /**
   * Fetch user information by email Id
   * @returns user Data Transfer Object if email Id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchUserByEmail(email: string): {
    userId: string,
    fullName: string,
    email: string,
    profilePicSrc: string,
  } | null;

  /**
   * Update user data
   * @returns data updated in the database
   * @throws DatabaseError if operation fails
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
