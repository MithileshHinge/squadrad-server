import session from 'express-session';
import { MongoClientOptions } from 'mongodb';
import ConnectMongoDbSession from 'connect-mongodb-session';
import config from '../../config';

export default function getStore() {
  const MongoDBStore = ConnectMongoDbSession(session);

  const store = new MongoDBStore({
    uri: config.database.uri,
    collection: config.database.sessionCollection,
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as MongoClientOptions,
  });

  store.on('error', (error: any) => {
    console.error(error);
  });

  return store;
}
