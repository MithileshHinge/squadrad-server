import session from 'express-session';
import { MongoClientOptions } from 'mongodb';
import ConnectMongoDBSession from 'connect-mongodb-session';
import config from '../../../config';

let mockStore: ConnectMongoDBSession.MongoDBStore;

export default function getMockStore() {
  const MongoDBStore = ConnectMongoDBSession(session);

  mockStore = new MongoDBStore({
    uri: process.env.MONGO_URL!,
    collection: config.database.sessionCollection,
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as MongoClientOptions,
  });

  mockStore.on('error', (error: any) => {
    console.error(error);
  });

  return mockStore;
}

export async function closeMockStoreConnection() {
  if (mockStore.client) await mockStore.client.close();
}
