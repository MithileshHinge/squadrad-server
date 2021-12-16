import { validateUserId } from '../userId';
import { IProfilePicsData } from './IProfilePicsData';
import { IProfilePicValidator } from './validator/IProfilePicValidator';

export default class SetProfilePic {
  private profilePicsData: IProfilePicsData;

  private profilePicValidator: IProfilePicValidator;

  private defaultSrcs = (() => {
    const defaultSrcsArray = [];
    for (let i = 1; i <= 7; i += 1) {
      const defaultSrc = `default/default_profile_pic${i}.jpg`;
      defaultSrcsArray.push(defaultSrc);
    }
    return defaultSrcsArray;
  })();

  constructor(profilePicsData: IProfilePicsData, profilePicValidator: IProfilePicValidator) {
    this.profilePicsData = profilePicsData;
    this.profilePicValidator = profilePicValidator;
  }

  async setDefault(userId: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const randIndex = Math.floor(Math.random() * 7); // Returns a random number between 0-6 inclusive
    const defaultSrc = this.defaultSrcs[randIndex];
    await this.profilePicsData.updateProfilePic(userIdValidated, defaultSrc, forCreator);
    return defaultSrc;
  }

  async setNew(userId: string, src: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const srcValidated = this.profilePicValidator.validateProfilePic(src);
    await this.profilePicsData.updateProfilePic(userIdValidated, srcValidated, forCreator);
    return srcValidated;
  }

  async revertToDefault(userId: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const randIndex = Math.floor(Math.random() * 7); // Returns a random number between 0-6 inclusive
    const defaultSrc = this.defaultSrcs[randIndex];
    await this.profilePicsData.updateProfilePic(userIdValidated, defaultSrc, forCreator);
    return defaultSrc;
  }
}
