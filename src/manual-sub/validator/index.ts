import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import stringValidator from '../../common/validators/stringValidator';
import ManualSubStatuses from '../ManualSubStatuses';
import { IManualSubValidator } from './IManualSubValidator';

const manualSubValidator: IManualSubValidator = {
  validateManualSubId(manualSubId: string) {
    if (typeof manualSubId !== 'string') throw new ValidationError('ManualSubId must be a string');
    const manualSubIdTrimmed = manualSubId.trim();
    if (!id.isValidId(manualSubIdTrimmed)) throw new ValidationError(`Goal id ${manualSubIdTrimmed} is not a valid id`);
    return manualSubIdTrimmed;
  },
  validateContactNumber(contactNumber: string) {
    if (typeof contactNumber !== 'string') throw new ValidationError('Contact number must be a string');
    const contactNumberTrimmed = contactNumber.trim();
    if (contactNumberTrimmed !== '' && !stringValidator.isMobilePhone(contactNumberTrimmed, false)) throw new ValidationError(`Contact number ${contactNumberTrimmed} is not a valid Indian mobile number`);
    return contactNumberTrimmed;
  },
  validateSubscriptionStatus(subscriptionStatus: number) {
    if (typeof subscriptionStatus !== 'number') throw new ValidationError('Subscription status must be a number');
    if (!(subscriptionStatus in ManualSubStatuses)) throw new ValidationError(`Subscription status number ${subscriptionStatus} is invalid`);
    return subscriptionStatus;
  },
};

export default manualSubValidator;
