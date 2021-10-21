import ValidationError from '../../common/errors/ValidationError';
import id from '../../common/id';
import { IUserIdValidator } from './IUserIdValidator';

const userIdValidator: IUserIdValidator = {
  validateUserId(userId: string): string {
    if (typeof userId !== 'string') throw new ValidationError('userId must be a string');
    const userIdTrimmed = userId.trim();
    if (!id.isValidId(userIdTrimmed)) throw new ValidationError(`userId "${userIdTrimmed}" is not a valid userId`);
    return userIdTrimmed;
  },
};

export default userIdValidator;
