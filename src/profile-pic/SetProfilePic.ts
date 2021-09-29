import { IUserData } from '../user/IUserData';
import profilePicBuilder from './entity';

export default class {
  userData: IUserData;

  constructor(userData: IUserData) {
    this.userData = userData;
  }

  setNew(userId: string, src: string): void {
    const profilePic = profilePicBuilder.build(src);
    this.userData.updateProfilePic(userId, profilePic.getSrc());
  }

  revertToDefault(userId: string) {
    const profilePic = profilePicBuilder.build('default.jpg');
    this.userData.updateProfilePic(userId, profilePic.getSrc());
  }
}
