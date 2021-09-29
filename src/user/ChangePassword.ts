import ValidationError from '../common/errors/ValidationError';
import userBuilder from './entity';
import { IUserRepo } from './IUserRepo';

export default class ChangePassword {
  userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  /**
   * Change password. Does not handle encryption, please ensure password is
   * being stored in encrypted form
   * @throws ValidationError if userId does not exist or newPassword is invalid
   * @throws DatabaseError if operation fails
   */
  change(userId: string, newPassword: string) {
    const userExisting = this.userRepo.fetchUserById(userId);
    if (!userExisting) throw new ValidationError(`User with userId "${userId}" does not exist`);
    const user = userBuilder.build({
      userId,
      password: newPassword,
    });
    this.userRepo.updatePassword(userId, user.getPassword!());
  }
}
