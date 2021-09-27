import id from '../../../services/id';
import faker from '../faker';

export default Array<{
  userId: string,
  fullName: string,
  email: string,
  password: string,
}>(10).fill((() => ({
  userId: id.createId(),
  fullName: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
}))());
