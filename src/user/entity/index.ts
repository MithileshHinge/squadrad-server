import id from '../id';
import userValidator from '../validator';
import passwordEncryption from '../password';
import UserBuilder from './UserBuilder';

const userBuilder = new UserBuilder(id, userValidator, passwordEncryption);

export default userBuilder;
