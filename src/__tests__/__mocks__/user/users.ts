import encryptionService from '../../../services/encryption-service';
import id from '../../../services/id';
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
  password: encryptionService.encrypt(faker.internet.password(8)),
  profilePicSrc: 'default.jpg',
}))());
