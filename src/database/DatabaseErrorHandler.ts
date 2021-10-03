import { MongoError } from 'mongodb';
import DatabaseError from '../common/errors/DatabaseError';

export default function handleDatabaseError(err: MongoError, message: string): never {
  const databaseError = new DatabaseError(message);
  databaseError.stack = err.stack;
  throw databaseError;
}
