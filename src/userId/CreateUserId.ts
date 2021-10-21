import { IId } from '../common/id';
import { IUsersData } from '../user/IUsersData';

export default class CreateUserId {
  private id: IId;

  constructor(id: IId) {
    this.id = id;
  }

  /**
   * Generates a new, unique userId
   * @param usersData The Users data access gateway implementation (used to check userId collisions)
   * @returns Promise to return a userId string
   * @throws DatabaseError if unique check operation fails
   */
  async create(usersData: IUsersData) {
    let userId = this.id.createId();
    // check if userId already exists in database
    // Note: CUID collisions are extremely improbable,
    // but my paranoia insists me to make a sanity check
    // eslint-disable-next-line no-await-in-loop
    while (await usersData.fetchUserById(userId)) {
      userId = this.id.createId();
    }

    return userId;
  }
}
