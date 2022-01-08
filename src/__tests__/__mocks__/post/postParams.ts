import id from '../../../common/id';
import faker from '../faker';

export default {
  // title: faker.lorem.words(3),
  description: [faker.lorem.paragraph(5).substr(0, 2000), undefined][faker.datatype.number(1)],
  squadId: [id.createId(), '', undefined][faker.datatype.number(2)],
};
