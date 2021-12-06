import { Collection, Document, ObjectId } from 'mongodb';
import { Express } from 'express';
import id from '../../../common/id';
import { getLoggedInCreator } from '../creator/creators';
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

export async function getCreatorWithSquads(app: Express, userCollection: Collection<Document>, squadCollection: Collection<Document>, numberOfSquads: number = 1) {
  const { agent, userId } = await getLoggedInCreator(app, userCollection);
  const squads = [];
  for (let i = 0; i < numberOfSquads; i += 1) {
    squads.push({ ...newSquad(), userId });
  }
  await squadCollection.insertMany(squads.map(({ squadId, ...squadInfo }) => ({
    _id: new ObjectId(squadId), ...squadInfo,
  })));
  return { agent, userId, squads };
}
