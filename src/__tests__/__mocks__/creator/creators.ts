import id from '../../../user/id';
import faker from '../faker';

export default function newCreator() {
  return {
    userId: id.createId(),
    pageName: faker.name.findName(),
    bio: faker.lorem.word(5),
    isPlural: faker.datatype.boolean(),
  };
}
