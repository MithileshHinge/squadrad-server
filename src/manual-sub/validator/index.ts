import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import { IManualSubValidator } from './IManualSubValidator';

const manualSubValidator: IManualSubValidator = {
  validateManualSubId(manualSubId: string) {
    if (typeof manualSubId !== 'string') throw new ValidationError('ManualSubId must be a string');
    const manualSubIdTrimmed = manualSubId.trim();
    if (!id.isValidId(manualSubIdTrimmed)) throw new ValidationError(`Goal id ${manualSubIdTrimmed} is not a valid id`);
    return manualSubIdTrimmed;
  },
};

export default manualSubValidator;
