import userBuilder from './entity';
import ValidationError from '../common/errors/ValidationError';
import { IUserData } from './IUserData';

export default class AddUser {
  private userData: IUserData;

  constructor(userData: IUserData) {
    this.userData = userData;
  }

  /**
   * AddUser use case: add new user to the database
   * @throws ValidationError if invalid parameters are provided or account already exists
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
  }): { userId: string, fullName: string, email: string, profilePicSrc: string } {
    let user = userBuilder.build({ fullName, email, password });

    if (this.userData.fetchUserByEmail(user.getEmail!())) throw new ValidationError('Another account already exists with the same email ID');

    // check if userId already exists in database
    // Note: CUID collisions are extremely improbable,
    // but my paranoia insists me to make a sanity check
    while (this.userData.fetchUserById(user.getId())) {
      user = userBuilder.build({ fullName, email, password });
    }

    const userInfo = {
      userId: user.getId(),
      fullName: user.getFullName!(),
      email: user.getEmail!(),
      profilePicSrc: user.getProfilePic(),
    };
    this.userData.insertIntoDb({ ...userInfo, password: user.getPassword!() });
    return userInfo;
  }
}
