import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import { ICommentValidator } from './ICommentValidator';

const commentValidator: ICommentValidator = {
  validateText(text: any) {
    if (typeof text !== 'string') throw new ValidationError('Comment text must be a string');
    const textTrimmed = text.trim();
    if (textTrimmed.length <= 0) throw new ValidationError('Comment text cannot be blank');
    return textTrimmed;
  },
  validateCommentId(commentId: any) {
    if (typeof commentId !== 'string') throw new ValidationError('Comment id must be a string');
    const commentIdTrimmed = commentId.trim();
    if (!id.isValidId(commentIdTrimmed)) throw new ValidationError(`Comment id ${commentId} is not a valid id`);
    return commentIdTrimmed;
  },
};

export default commentValidator;
