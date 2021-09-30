import { IUsersData } from '../user/IUsersData';
import { IProfilePicValidator } from './validator/IProfilePicValidator';

export default class {
  private usersData: IUsersData;

  private profilePicValidator: IProfilePicValidator;

  private defaultSrc = 'default.jpg';

  constructor(usersData: IUsersData, profilePicValidator: IProfilePicValidator) {
    this.usersData = usersData;
    this.profilePicValidator = profilePicValidator;
  }

  setDefault(userId: string): string {
    this.usersData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }

  setNew(userId: string, src: string): string {
    const srcValidated = this.profilePicValidator.validateProfilePic(src);
    this.usersData.updateProfilePic(userId, srcValidated);
    return srcValidated;
  }

  revertToDefault(userId: string): string {
    this.usersData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }
}
