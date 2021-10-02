/* eslint-disable no-underscore-dangle */
import { MongoClient, MongoClientOptions } from 'mongodb';
import { handleDatabaseError } from '../../../database';

const client = new MongoClient(process.env.MONGO_URL!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as MongoClientOptions);

export default async function getDb() {
  try {
    const connection = await client.connect();
    return connection.db();
  } catch (err: any) {
    return handleDatabaseError(err, 'Could not connect to database');
  }
}

export async function closeConnection() {
  try {
    await client.close();
  } catch (err: any) {
    handleDatabaseError(err, 'Could not close database connection');
  }
}
