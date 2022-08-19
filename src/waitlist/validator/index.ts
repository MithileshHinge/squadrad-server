import ValidationError from '../../common/errors/ValidationError';
import IWaitlistValidator from './IWaitlistValidator';

const waitlistValidator: IWaitlistValidator = {
  validateFeatures(features) {
    if (!Array.isArray(features)) throw new ValidationError('features must be an array');
    if (!features.every((feature) => typeof feature === 'string' && ['membership', 'merch', 'freelance'].includes(feature))) throw new ValidationError('features must be an array of strings [\'membership\', \'merch\', \'freelance\']');
    return features;
  },
};

export default waitlistValidator;
