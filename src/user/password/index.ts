import bcrypt from 'bcrypt';
import { IPasswordEncryption } from './IPasswordEncryption';

const passwordEncryption: IPasswordEncryption = {
  encrypt(password) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  },
  compare(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
  },
};

export default passwordEncryption;
