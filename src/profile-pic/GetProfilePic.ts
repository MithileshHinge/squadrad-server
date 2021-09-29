import ValidationError from '../common/errors/ValidationError';
import { IUserData } from '../user/IUserData';

export default class GetProfilePic {
  userData: IUserData;

  constructor(userData: IUserData) {
    this.userData = userData;
  }

  /**
   * Get profile picture of any user
   * @throws ValidationError if user does not exist
   * @throws DatabaseError if operation fails
   */
  get(userId: string): string {
    const src = this.userData.fetchProfilePic(userId);
    if (!src) throw new ValidationError(`User with userId="${userId}" does not exist.`);
    return src;
  }
}
