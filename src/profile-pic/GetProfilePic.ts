import ValidationError from '../common/errors/ValidationError';
import { validateUserId } from '../userId';
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
  async get(userId: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const src = await this.profilePicsData.fetchProfilePic(userIdValidated, forCreator);
    if (!src) throw new ValidationError(`User with userId="${userIdValidated}" does not exist.`);
    return src;
  }
}
