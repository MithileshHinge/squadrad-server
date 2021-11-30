import faker from '../faker';

export default {
  title: faker.lorem.words(3),
  amount: faker.datatype.number({ min: 30, precision: 0.01 }),
  description: [faker.lorem.paragraph(5).substr(0, 2000), undefined][faker.datatype.number(1)],
  membersLimit: [faker.datatype.number({ min: 0, precision: 1 }), undefined][faker.datatype.number(1)],
};
