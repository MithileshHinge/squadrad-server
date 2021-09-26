import userBuilder from './entity';
import ValidationError from '../common/errors/ValidationError';
import FindUser from './FindUser';
import { IUserRepo } from './IUserRepo';
import IUserDTO from './IUserDTO';

export default class AddUser {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  /**
   * AddUser use case: add new user to the database
   * @throws ValidationError if invalid parameters are provided
   * @throws DatabaseError when there is an error in inserting user into database
   */
  add({
    fullName,
    email,
    password,
  }: {
    fullName: string,
    email: string,
    password: string
  }): IUserDTO {
    let user = userBuilder.build({ fullName, email, password });

    if (this.userRepo.fetchUserByEmail(user.getEmail())) throw new ValidationError('Another account already exists with the same email ID');

    // check if userID already exists in database
    // Note: CUID collisions are extremely improbable,
    // but my paranoia insists me to make a sanity check
    const findUser = new FindUser(this.userRepo);
    while (findUser.findUserById(user.getId())) {
      user = userBuilder.build({ fullName, email, password });
    }

    const userInfo: IUserDTO = {
      userId: user.getId(),
      fullName: user.getFullName(),
      email: user.getEmail(),
    };
    this.userRepo.insertIntoDb({ userInfo, password: user.getPassword()! });
    return userInfo;
  }
}
