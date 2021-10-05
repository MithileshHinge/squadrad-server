import passwordEncryption from '../../../user/password';
import id from '../../../user/id';
import faker from '../faker';

export function newUser() {
  return {
    userId: id.createId(),
    fullName: faker.name.findName(),
    email: faker.internet.email(),
    password: passwordEncryption.encrypt(faker.internet.password(8)),
    profilePicSrc: 'default.jpg',
    verified: faker.datatype.boolean(),
  };
}

export default Array.from({ length: 10 }, newUser);
