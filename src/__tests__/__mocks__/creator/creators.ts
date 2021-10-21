import { Express } from 'express';
import { Collection, Document } from 'mongodb';
import id from '../../../common/id';
import faker from '../faker';
import { getLoggedInUser } from '../user/users';
import sampleCreatorParams from './creatorParams';

export default function newCreator() {
  return {
    userId: id.createId(),
    pageName: faker.name.findName(),
    bio: faker.lorem.word(5),
    isPlural: faker.datatype.boolean(),
  };
}

export async function getLoggedInCreator(app: Express, userCollection: Collection<Document>) {
  const { agent, userId } = await getLoggedInUser(app, userCollection);
  await agent.post('/creator').send({ userId, ...sampleCreatorParams });
  return { agent, userId, ...sampleCreatorParams };
}
