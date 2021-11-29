import faker from '../faker';

export default {
  title: faker.lorem.words(3),
  description: [faker.lorem.paragraph(5).substr(0, 2000), null][faker.datatype.number(1)],
  goalNumber: faker.datatype.number({ min: 1, precision: 1 }),
};
