import ValidationError from '../common/errors/ValidationError';
import { IUserRepo } from '../repositories/user-repo/IUserRepo';

export default class GetProfilePic {
  userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  /**
   * Get profile picture of any user
   * @throws ValidationError if user does not exist
   * @throws DatabaseError if operation fails
   */
  get(userId: string): string {
    const src = this.userRepo.fetchProfilePic(userId);
    if (!src) throw new ValidationError(`User with userId="${userId}" does not exist.`);
    return src;
  }
}
