import faker from '../faker';

export default {
  pageName: faker.name.findName(),
  bio: faker.lorem.word(5),
  isPlural: faker.datatype.boolean(),
};
