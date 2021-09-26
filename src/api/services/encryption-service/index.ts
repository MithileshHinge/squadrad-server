import crypto from 'crypto';
import { IEncryptionService } from './IEncryptionService';

const encryptionService: IEncryptionService = {
  encrypt(password) {
    return password + crypto.randomBytes(16).toString('hex');
  },
  compare() {
    return true;
  },
};

export default encryptionService;
