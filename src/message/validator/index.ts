import ValidationError from '../../common/errors/ValidationError';
import IMessageValidator from './IMessageValidator';

const messageValidator: IMessageValidator = {
  validateText(text: any): string {
    if (typeof text !== 'string') throw new ValidationError('Message text must be a string');
    const textTrimmed = text.trim();
    if (textTrimmed.length <= 0) throw new ValidationError('Message text must not be empty');
    return textTrimmed;
  },
  validateIsSenderCreator(isSenderCreator: any): boolean {
    if (typeof isSenderCreator !== 'boolean') throw new ValidationError('Message isSenderCreator must be a boolean');
    return isSenderCreator;
  },
};

export default messageValidator;
