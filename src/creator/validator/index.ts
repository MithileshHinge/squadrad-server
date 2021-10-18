import ValidationError from '../../common/errors/ValidationError';
import stringValidator from '../../common/validators/stringValidator';
import { ICreatorValidator } from './ICreatorValidator';

const creatorValidator: ICreatorValidator = {
  validatePageName(pageName: string): string {
    const pageNameTrimmed = pageName.trim();
    if (!stringValidator.minLength(pageNameTrimmed, 3)) throw new ValidationError(`Page name "${pageNameTrimmed}" must have at least 3 letters`);
    if (!stringValidator.maxLength(pageNameTrimmed, 50)) throw new ValidationError(`Page name "${pageNameTrimmed}" must not be longer than 50 characters`);
    if (pageNameTrimmed.includes('  ')) throw new ValidationError(`Page name "${pageNameTrimmed}" cannot contain more than one consecutive spaces`);
    return pageNameTrimmed;
  },
  validateBio(bio: string): string {
    const bioTrimmed = bio.trim();
    if (!stringValidator.minLength(bioTrimmed, 3)) throw new ValidationError(`Bio "${bioTrimmed}" must have at least 3 letters`);
    if (!stringValidator.maxLength(bioTrimmed, 50)) throw new ValidationError(`Bio "${bioTrimmed}" must not be longer than 50 characters`);
    if (bioTrimmed.includes('  ')) throw new ValidationError(`Bio "${bioTrimmed}" cannot contain more than one consecutive spaces`);
    if (!stringValidator.isAlphaAndSpaces(bioTrimmed)) throw new ValidationError(`Bio "${bioTrimmed}" must only contain letters and spaces`);
    return bioTrimmed;
  },
};

export default creatorValidator;
