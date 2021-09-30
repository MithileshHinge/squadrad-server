import ValidationError from '../common/errors/ValidationError';
import { IProfilePicsData } from './IProfilePicsData';

export default class GetProfilePic {
  private profilePicsData: IProfilePicsData;

  constructor(profilePicsData: IProfilePicsData) {
    this.profilePicsData = profilePicsData;
  }

  /**
   * Get profile picture of any user
   * @throws ValidationError if user does not exist
   * @throws DatabaseError if operation fails
   */
  get(userId: string): string {
    const src = this.profilePicsData.fetchProfilePic(userId);
    if (!src) throw new ValidationError(`User with userId="${userId}" does not exist.`);
    return src;
  }
}
