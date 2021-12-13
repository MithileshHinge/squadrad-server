import id from '../../../common/id';
import faker from '../faker';

export default function newPost() {
  return {
    postId: id.createId(),
    userId: id.createId(),
    // title: faker.lorem.words(3),
    description: [faker.lorem.paragraph(5).substr(0, 2000), ''][faker.datatype.number(1)],
    squadId: [id.createId(), ''][faker.datatype.number(1)],
  };
}
