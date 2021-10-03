import { IProfilePicsData } from './IProfilePicsData';
import { IProfilePicValidator } from './validator/IProfilePicValidator';

export default class SetProfilePic {
  private profilePicsData: IProfilePicsData;

  private profilePicValidator: IProfilePicValidator;

  private defaultSrc = 'default.jpg';

  constructor(profilePicsData: IProfilePicsData, profilePicValidator: IProfilePicValidator) {
    this.profilePicsData = profilePicsData;
    this.profilePicValidator = profilePicValidator;
  }

  async setDefault(userId: string): Promise<string> {
    await this.profilePicsData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }

  async setNew(userId: string, src: string): Promise<string> {
    const srcValidated = this.profilePicValidator.validateProfilePic(src);
    await this.profilePicsData.updateProfilePic(userId, srcValidated);
    return srcValidated;
  }

  async revertToDefault(userId: string): Promise<string> {
    await this.profilePicsData.updateProfilePic(userId, this.defaultSrc);
    return this.defaultSrc;
  }
}
