import { IProfilePicValidator } from '../validator/IProfilePicValidator';
import { IProfilePic } from './IProfilePic';

export default class ProfilePicBuilder {
  profilePicValidator: IProfilePicValidator;

  constructor(profilePicValidator: IProfilePicValidator) {
    this.profilePicValidator = profilePicValidator;
  }

  /**
   * Build a profile pic entity
   * @param src The profile picture file's path on server
   * @throws ValidationError if file does not exist or file is not accessible
   */
  build(src: string): IProfilePic {
    const validatedSrc = this.profilePicValidator.validateProfilePic(src);
    return {
      getSrc: () => validatedSrc,
    };
  }
}
