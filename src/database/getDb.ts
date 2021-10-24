import { MongoClient } from 'mongodb';
import config from '../config';
import handleDatabaseError from './DatabaseErrorHandler';

const { uri, dbName } = config.database;
const client = new MongoClient(uri);

export default async function getDb() {
  try {
    // Returns existing connection if client already connected, also handles pooling internally
    const connection = await client.connect();
    const db = connection.db(dbName);
    return db;
  } catch (err: any) {
    return handleDatabaseError(err, 'Connection to MongoDb server failed');
  }
}
