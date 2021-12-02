import id from '../../../common/id';
import ManualSubStatuses from '../../../manual-sub/ManualSubStatuses';
import faker from '../faker';

export default function newManualSub() {
  return {
    manualSubId: id.createId(),
    userId: id.createId(),
    creatorUserId: id.createId(),
    squadId: id.createId(),
    amount: faker.datatype.number(1000),
    contactNumber: faker.phone.phoneNumber('+91##########'),
    subscriptionStatus: faker.datatype.number(Object.values(ManualSubStatuses).length - 1),
  };
}
