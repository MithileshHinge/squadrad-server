import IUserDTO from './IUserDTO';
import { IUserRepo } from '../repositories/user-repo/IUserRepo';

export default class FindUser {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  /**
   * Find all users
   * @returns array of user Data Transfer Object if users exists, otherwise returns empty array []
   * @throws DatabaseError if operation fails
   */
  findAllUsers(): IUserDTO[] {
    return this.userRepo.fetchAllUsers();
  }

  /**
   * Find user by userId
   * @returns user Data Transfer Object if id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  findUserById(userId: string) {
    const user = this.userRepo.fetchUserById(userId);
    return user;
  }

  /**
   * Find user by email ID
   * @returns user Data Transfer Object if email Id exists, otherwise returns null
   * @throws DatabaseError if operation fails
   */
  findUserByEmail(email: string) {
    const user = this.userRepo.fetchUserByEmail(email);
    return user;
  }
}
