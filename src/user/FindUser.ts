import GetProfilePic from '../profile-pic/GetProfilePic';
import { validateUserId } from '../userId';
import { IUsersData } from './IUsersData';
import { IUserValidator } from './validator/IUserValidator';

export default class FindUser {
  private getProfilePic: GetProfilePic;

  private usersData: IUsersData;

  private userValidator: IUserValidator;

  constructor(getProfilePic: GetProfilePic, usersData: IUsersData, userValidator: IUserValidator) {
    this.getProfilePic = getProfilePic;
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
  }[]> {
    const users = await this.usersData.fetchAllUsers();
    const usersInfoToReturn = users.map((user) => ({
      userId: user.userId,
      fullName: user.fullName,
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
    const profilePicSrc = await this.getProfilePic.get(userIdValidated, false);

    if (user) {
      return {
        userId: user.userId,
        fullName: user.fullName,
        profilePicSrc,
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
      const profilePicSrc = await this.getProfilePic.get(user.userId, false);
      return {
        userId: user.userId,
        fullName: user.fullName,
        profilePicSrc,
      };
    }
    return null;
  }
}
