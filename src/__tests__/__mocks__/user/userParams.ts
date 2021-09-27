import faker from '../faker';

export default {
  fullName: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
};
