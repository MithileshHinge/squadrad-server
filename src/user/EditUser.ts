import userBuilder from './entity';
import ValidationError from '../common/errors/ValidationError';
import { IUserRepo } from '../repositories/user-repo/IUserRepo';

export default class EditUser {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  /**
   * EditUser use case: Only allowed fields can be edited. userId must be provided.
   * @throws ValidationError if invalid parameters are provided
   * @throws DatabaseError if operation fails
   */
  edit(userInfo: { userId: string, fullName?: string }) {
    const userExisting = this.userRepo.fetchUserById(userInfo.userId);
    if (!userExisting) throw new ValidationError(`User with userId="${userInfo.userId}" does not exist`);
    const user = userBuilder.build(userInfo);
    const userToUpdate = {
      userId: user.getId(),
      fullName: user.getFullName ? user.getFullName() : undefined,
    };
    this.userRepo.updateUser(userToUpdate);
  }
}
