import { validateUserId } from '../userId';
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

  async setDefault(userId: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    await this.profilePicsData.updateProfilePic(userIdValidated, this.defaultSrc, forCreator);
    return this.defaultSrc;
  }

  async setNew(userId: string, src: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const srcValidated = this.profilePicValidator.validateProfilePic(src);
    await this.profilePicsData.updateProfilePic(userIdValidated, srcValidated, forCreator);
    return srcValidated;
  }

  async revertToDefault(userId: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    await this.profilePicsData.updateProfilePic(userIdValidated, this.defaultSrc, forCreator);
    return this.defaultSrc;
  }
}
