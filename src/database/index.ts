import { MongoClient, MongoError } from 'mongodb';
import DatabaseError from '../common/errors/DatabaseError';

const url = 'mongodb://localhost:27017';
const dbName = 'squadrad';
const client = new MongoClient(url);

export function handleDatabaseError(err: MongoError, message: string): never {
  const databaseError = new DatabaseError(message);
  databaseError.stack = err.stack;
  throw databaseError;
}

export async function getDb() {
  try {
    // Returns existing connection if client already connected, also handles pooling internally
    const connection = await client.connect();
    const db = connection.db(dbName);
    return db;
  } catch (err: any) {
    return handleDatabaseError(err, 'Connection to MongoDb server failed');
  }
}
