import id from '../../services/id';
import validationService from '../../services/validation-service';
import encryptionService from '../../services/encryption-service';
import UserBuilder from './UserBuilder';

const userBuilder = new UserBuilder(id, validationService, encryptionService);

export default userBuilder;
