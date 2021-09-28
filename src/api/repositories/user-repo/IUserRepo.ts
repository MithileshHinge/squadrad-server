import IUserDTO from '../../user/IUserDTO';

export interface IUserRepo {

  /**
   * Insert new row into Users table
   * @throws DatabaseError if operation fails
   */
  insertIntoDb({
    userInfo,
    password,
  }: { userInfo: IUserDTO, password: string }): void;

  /**
   * Fetch all users in the database
   * @returns array of user Data Transfer Objects if users exist, otherwise returns empty array []
   * @throws DatabaseError if operation fails
   */
  fetchAllUsers(): IUserDTO[];

  /**
   * Fetch user information by user Id
   * @returns user Data Transfer Object if user id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchUserById(userId: string): IUserDTO | null;

  /**
   * Fetch user information by email Id
   * @returns user Data Transfer Object if email Id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  fetchUserByEmail(email: string): IUserDTO | null;

  /**
   * Update user data
   * @throws DatabaseError if operation fails
   */
  updateUser(userInfo: IUserDTO): void;

  /**
   * Update password field, please ensure password is stored in encrypted format
   * @throws DatabaseError if operation fails
   */
  updatePassword(userId: string, newPassword: string): void;

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