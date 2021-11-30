import id from '../../../common/id';
import faker from '../faker';

export default function newSquad() {
  return {
    squadId: id.createId(),
    userId: id.createId(),
    title: faker.lorem.words(3),
    amount: faker.datatype.number({ min: 30, precision: 0.01 }),
    description: [faker.lorem.paragraph(5).substr(0, 2000), ''][faker.datatype.number(1)],
    membersLimit: faker.datatype.number({ min: 0, precision: 1 }),
  };
}
