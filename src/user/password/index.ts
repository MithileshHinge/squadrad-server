import crypto from 'crypto';
import { IPasswordEncryption } from './IPasswordEncryption';

const passwordEncryption: IPasswordEncryption = {
  encrypt(password) {
    return password + crypto.randomBytes(16).toString('hex');
  },
  compare() {
    return true;
  },
};

export default passwordEncryption;
