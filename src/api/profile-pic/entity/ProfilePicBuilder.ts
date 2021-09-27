import { IValidationService } from '../../../services/validation-service/IValidationService';
import { IProfilePic } from './IProfilePic';

export default class ProfilePicBuilder {
  validationService: IValidationService;

  constructor(validationService: IValidationService) {
    this.validationService = validationService;
  }

  /**
   * Build a profile pic entity
   * @param src The profile picture file's path on server
   * @throws ValidationError if file does not exist or file is not accessible
   */
  build(src: string): IProfilePic {
    const validatedSrc = this.validationService.validateProfilePic(src);
    return {
      src: validatedSrc,
    };
  }
}
