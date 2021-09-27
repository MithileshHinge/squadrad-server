import userBuilder from './entity';
import ValidationError from '../common/errors/ValidationError';
import FindUser from './FindUser';
import { IUserRepo } from './IUserRepo';
import IUserDTO from './IUserDTO';

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
    const findUser = new FindUser(this.userRepo);
    const userExisting = findUser.findUserById(userInfo.userId);
    if (!userExisting) throw new ValidationError(`User with userId="${userInfo.userId}" does not exist`);
    const user = userBuilder.build({ ...userExisting, ...userInfo });
    const userToUpdate: IUserDTO = {
      userId: user.getId(),
      fullName: user.getFullName(),
      email: user.getEmail(),
    };
    this.userRepo.updateUser(userToUpdate);
  }
}
