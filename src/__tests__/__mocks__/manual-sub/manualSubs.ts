import id from '../../../common/id';
import faker from '../faker';

export default function newManualSub() {
  return {
    manualSubId: id.createId(),
    userId: id.createId(),
    creatorUserId: id.createId(),
    squadId: id.createId(),
    amount: faker.datatype.number({ min: 30 }),
    contactNumber: ['+917507504857', '8328438934', '9923292390'][faker.datatype.number(2)],
    subscriptionStatus: faker.datatype.number(2),
  };
}
