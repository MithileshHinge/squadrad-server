import { IUsersData } from './IUsersData';

export default class FindUser {
  private usersData: IUsersData;

  constructor(usersData: IUsersData) {
    this.usersData = usersData;
  }

  /**
   * Find all users
   * @returns array of user Data Transfer Object if users exists, otherwise returns empty array []
   * @throws DatabaseError if operation fails
   */
  findAllUsers(): {
    userId: string,
    fullName: string,
    profilePicSrc: string,
  }[] {
    const users = this.usersData.fetchAllUsers();
    const usersInfoToReturn = users.map((user) => ({
      userId: user.userId,
      fullName: user.fullName,
      profilePicSrc: user.profilePicSrc,
    }));

    return usersInfoToReturn;
  }

  /**
   * Find user by userId
   * @returns user Data Transfer Object if id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  findUserById(userId: string): {
    userId: string,
    fullName: string,
    profilePicSrc: string,
  } | null {
    const user = this.usersData.fetchUserById(userId);
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
   * @returns user Data Transfer Object if email Id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  findUserByEmail(email: string): {
    userId: string,
    fullName: string,
    profilePicSrc: string,
  } | null {
    const user = this.usersData.fetchUserByEmail(email);
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
