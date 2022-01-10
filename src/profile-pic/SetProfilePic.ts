import crypto from 'crypto';
import { emptyDir, moveFile } from '../common/helpers';
import config from '../config';
import { validateUserId } from '../userId';
import { IProfilePicsData } from './IProfilePicsData';
import { IProfilePicValidator } from './validator/IProfilePicValidator';

export default class SetProfilePic {
  private profilePicsData: IProfilePicsData;

  private profilePicValidator: IProfilePicValidator;

  private defaultSrcs = (() => {
    const defaultSrcsArray = [];
    for (let i = 1; i <= 7; i += 1) {
      const defaultSrc = `defaults/default_profile_pic${i}.jpg`;
      defaultSrcsArray.push(defaultSrc);
    }
    return defaultSrcsArray;
  })();

  constructor(profilePicsData: IProfilePicsData, profilePicValidator: IProfilePicValidator) {
    this.profilePicsData = profilePicsData;
    this.profilePicValidator = profilePicValidator;
  }

  /**
   * Set default profile pic, profilePicSrc will be relative to config.profilePicsDir
   * @param forCreator If true, sets profilePic for creator with given userId
   * @returns default profile pic's src relative to config.profilePicsDir
   * @throws ValidationError if userId is not valid
   * @throws DatabaseError if operation fails
   */
  async setDefault(userId: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const randIndex = Math.floor(Math.random() * 7); // Returns a random number between 0-6 inclusive
    const defaultSrc = this.defaultSrcs[randIndex];
    await this.profilePicsData.updateProfilePic(userIdValidated, defaultSrc, forCreator);
    return defaultSrc;
  }

  /**
   * Set new profile pic, profilePicSrc will be relative to config.profilePicsDir
   * Moves file at src into profilePicsDir
   * @param src Temporary file source relative to config.tmpDir
   * @param forCreator If true, sets profilePic for creator with given userId
   * @returns profile pic's src relative to config.profilePicsDir
   * @throws ValidationError if file doesn't exist or params are invalid
   * @throws DatabaseError if operation is invalid
   */
  async setNew(userId: string, src: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const srcValidated = this.profilePicValidator.validateProfilePic(src);
    const randomFilename = crypto.pseudoRandomBytes(10).toString('hex');
    let dest = `${forCreator ? 'creators' : 'users'}/${userIdValidated}`;
    await emptyDir(`${config.profilePicsDir}/${dest}`); // Remove old profile pic if exists, or create empty dir
    dest += `/${randomFilename}`;
    await moveFile(`${config.tmpDir}/${srcValidated}`, `${config.profilePicsDir}/${dest}`);
    await this.profilePicsData.updateProfilePic(userIdValidated, dest, forCreator);
    return dest;
  }

  async revertToDefault(userId: string, forCreator: boolean): Promise<string> {
    const userIdValidated = validateUserId.validate(userId);
    const randIndex = Math.floor(Math.random() * 7); // Returns a random number between 0-6 inclusive
    const defaultSrc = this.defaultSrcs[randIndex];
    await this.profilePicsData.updateProfilePic(userIdValidated, defaultSrc, forCreator);
    return defaultSrc;
  }
}
