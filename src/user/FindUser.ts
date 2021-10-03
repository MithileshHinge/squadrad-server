import { IUsersData } from './IUsersData';

export default class FindUser {
  private usersData: IUsersData;

  constructor(usersData: IUsersData) {
    this.usersData = usersData;
  }

  /**
   * Find all users
   * @returns Promise to return array of user info if users exists, otherwise returns empty array []
   * @throws DatabaseError if operation fails

  async findAllUsers(): Promise<{
    userId: string,
    fullName: string,
    profilePicSrc: string,
  }[]> {
    const users = await this.usersData.fetchAllUsers();
    const usersInfoToReturn = users.map((user) => ({
      userId: user.userId,
      fullName: user.fullName,
      profilePicSrc: user.profilePicSrc,
    }));

    return usersInfoToReturn;
  }
  */

  /**
   * Find user by userId
   * @returns Promise to return user info if id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  async findUserById(userId: string): Promise<{
    userId: string,
    fullName: string,
    profilePicSrc: string,
  } | null> {
    const user = await this.usersData.fetchUserById(userId);
    if (user) {
      return {
        userId: user.userId,
        fullName: user.fullName,
        profilePicSrc: user.profilePicSrc,
      };
    }
    return null;
  }

  /**
   * Find user by email ID
   * @returns Promise to return user info if email Id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  async findUserByEmail(email: string): Promise<{
    userId: string,
    fullName: string,
    profilePicSrc: string,
  } | null> {
    const user = await this.usersData.fetchUserByEmail(email);
    if (user) {
      return {
        userId: user.userId,
        fullName: user.fullName,
        profilePicSrc: user.profilePicSrc,
      };
    }
    return null;
  }
}
