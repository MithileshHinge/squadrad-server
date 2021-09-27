import id from '../../../services/id';
import validationService from '../../../services/validation-service';
import UserBuilder from './UserBuilder';
import encryptionService from '../../../services/encryption-service';

const userBuilder = new UserBuilder(id, validationService, encryptionService);

export default userBuilder;
