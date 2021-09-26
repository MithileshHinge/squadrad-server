import id from '../../services/id';
import validationHelper from '../../services/validation-helper';
import UserBuilder from './UserBuilder';
import encryptionService from '../../services/encryption-service';

const userBuilder = new UserBuilder(id, validationHelper, encryptionService);

export default userBuilder;
