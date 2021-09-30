import { IProfilePicsData } from './IProfilePicsData';
import { IProfilePicValidator } from './validator/IProfilePicValidator';

export default class {
  private profilePicsData: IProfilePicsData;

  private profilePicValidator: IProfilePicValidator;

  private defaultSrc = 'default.jpg';

  constructor(profilePicsData: IProfilePicsData, profilePicValidator: IProfilePicValidator) {
    this.profilePicsData = profilePicsData;
    this.profilePicValidator = profilePicValidator;
  }

  setDefault(userId: string): string {
    this.profilePicsData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }

  setNew(userId: string, src: string): string {
    const srcValidated = this.profilePicValidator.validateProfilePic(src);
    this.profilePicsData.updateProfilePic(userId, srcValidated);
    return srcValidated;
  }

  revertToDefault(userId: string): string {
    this.profilePicsData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }
}
