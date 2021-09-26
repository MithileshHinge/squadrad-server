// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

faker.locale = 'en_IND';
faker.name.jobArea = () => '';
faker.name.jobDescriptor = () => '';
faker.name.jobTitle = () => '';
faker.name.jobType = () => '';
faker.name.prefix = () => '';
faker.name.suffix = () => '';
faker.name.title = () => '';

export default faker;
