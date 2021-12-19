import { Collection, Document, ObjectId } from 'mongodb';
import request, { SuperAgentTest } from 'supertest';
import { Express } from 'express';
import passwordEncryption from '../../../user/password';
import id from '../../../common/id';
import faker from '../faker';
import { HTTPResponseCode } from '../../../api/HttpResponse';

export function newUser() {
  return {
    userId: id.createId(),
    fullName: faker.name.findName(),
    email: faker.internet.email(),
    password: passwordEncryption.encrypt(faker.internet.password(8)),
    profilePicSrc: 'default.jpg',
    verified: faker.datatype.boolean(),
  };
}

export default Array.from({ length: 10 }, newUser);

export async function getRegisteredUser(userCollection: Collection<Document>, { verified }: { verified: boolean }): Promise<{
  userId: string, email: string, password: string, fullName: string, profilePicSrc: string,
}> {
  // insert new verified user for testing
  const {
    userId: tempUserId,
    password: tempPassword,
    verified: tempVerified,
    ...tempUser
  } = newUser();

  const userId = tempUserId;
  const password = faker.internet.password();
  await userCollection.insertOne({
    _id: new ObjectId(userId),
    password: passwordEncryption.encrypt(password),
    verified,
    ...tempUser,
  });

  return {
    userId,
    password,
    ...tempUser,
  };
}

export async function getLoggedInUser(app: Express, userCollection: Collection<Document>): Promise<{
  agent: SuperAgentTest, userId: string, email: string, password: string, fullName: string, profilePicSrc: string,
}> {
  const agent = request.agent(app);

  const {
    userId, email, password, fullName, profilePicSrc,
  } = await getRegisteredUser(userCollection, { verified: true });

  // log in user
  await agent.post('/user/login').send({ email, password }).expect(HTTPResponseCode.OK);

  return {
    agent,
    userId,
    email,
    password,
    fullName,
    profilePicSrc,
  };
}
