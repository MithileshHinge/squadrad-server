import { validateUserId } from '../userId';
import { IUsersData } from './IUsersData';
import { IUserValidator } from './validator/IUserValidator';

export default class FindUser {
  private usersData: IUsersData;

  private userValidator: IUserValidator;

  constructor(usersData: IUsersData, userValidator: IUserValidator) {
    this.usersData = usersData;
    this.userValidator = userValidator;
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
   * Find user by userId, returns private information if self is true
   * @returns Promise to return user info if id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  async findUserById(userId: string, self?: boolean): Promise<{
    userId: string,
    fullName: string,
    email?: string,
    profilePicSrc: string,
  } | null> {
    const userIdValidated = validateUserId.validate(userId);
    const user = await this.usersData.fetchUserById(userIdValidated);
    if (user) {
      return {
        userId: user.userId,
        fullName: user.fullName,
        profilePicSrc: user.profilePicSrc,
        email: self ? user.email : undefined,
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
    const emailValidated = this.userValidator.validateEmail(email);
    const user = await this.usersData.fetchUserByEmail(emailValidated);
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
