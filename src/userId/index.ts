import id from '../common/id';
import CreateUserId from './CreateUserId';
import ValidateUserId from './ValidateUserId';
import userIdValidator from './validator';

export const createUserId = new CreateUserId(id);
export const validateUserId = new ValidateUserId(userIdValidator);
