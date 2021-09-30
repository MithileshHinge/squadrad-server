import { IUserData } from '../user/IUserData';
import { IProfilePicValidator } from './validator/IProfilePicValidator';

export default class {
  private userData: IUserData;

  private profilePicValidator: IProfilePicValidator;

  private defaultSrc = 'default.jpg';

  constructor(userData: IUserData, profilePicValidator: IProfilePicValidator) {
    this.userData = userData;
    this.profilePicValidator = profilePicValidator;
  }

  setDefault(userId: string): string {
    this.userData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }

  setNew(userId: string, src: string): string {
    const srcValidated = this.profilePicValidator.validateProfilePic(src);
    this.userData.updateProfilePic(userId, srcValidated);
    return srcValidated;
  }

  revertToDefault(userId: string): string {
    this.userData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }
}
