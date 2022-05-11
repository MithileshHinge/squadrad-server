import ValidationError from '../../common/errors/ValidationError';
import { ICommentValidator } from './ICommentValidator';

const commentValidator: ICommentValidator = {
  validateText(text: any) {
    if (typeof text !== 'string') throw new ValidationError('Comment text must be a string');
    const textTrimmed = text.trim();
    if (textTrimmed.length <= 0) throw new ValidationError('Comment text cannot be blank');
    return textTrimmed;
  },
};

export default commentValidator;
