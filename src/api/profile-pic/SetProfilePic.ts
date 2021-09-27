import { IUserRepo } from '../user/IUserRepo';
import profilePicBuilder from './entity';

export default class {
  userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  setNew(userId: string, src: string): void {
    const profilePic = profilePicBuilder.build(src);
    this.userRepo.updateProfilePic(userId, profilePic.src);
  }
}
