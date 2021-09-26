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
   * @throws DatabaseError when there is an error in inserting user into database
   */
  edit(userInfo: { userId: string, fullName?: string }) {
    const findUser = new FindUser(this.userRepo);
    const userExisting = findUser.findUserById(userInfo.userId);
    if (!userExisting) throw new ValidationError(`User with userID="${userInfo.userId}" does not exist`);
    const deb = { ...userExisting, ...userInfo };
    const user = userBuilder.build(deb);
    const userToUpdate: IUserDTO = {
      userId: user.getId(),
      fullName: user.getFullName(),
      email: user.getEmail(),
    };
    this.userRepo.updateUser(userToUpdate);
  }
}
