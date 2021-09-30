import ValidationError from '../common/errors/ValidationError';
import { IUsersData } from '../user/IUsersData';

export default class GetProfilePic {
  usersData: IUsersData;

  constructor(usersData: IUsersData) {
    this.usersData = usersData;
  }

  /**
   * Get profile picture of any user
   * @throws ValidationError if user does not exist
   * @throws DatabaseError if operation fails
   */
  get(userId: string): string {
    const src = this.usersData.fetchProfilePic(userId);
    if (!src) throw new ValidationError(`User with userId="${userId}" does not exist.`);
    return src;
  }
}
