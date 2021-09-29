import passwordEncryption from '../../../user/password';
import id from '../../../user/id';
import faker from '../faker';

export default Array<{
  userId: string,
  fullName: string,
  email: string,
  password: string,
  profilePicSrc: string,
}>(10).fill((() => ({
  userId: id.createId(),
  fullName: faker.name.findName(),
  email: faker.internet.email(),
  password: passwordEncryption.encrypt(faker.internet.password(8)),
  profilePicSrc: 'default.jpg',
}))());
