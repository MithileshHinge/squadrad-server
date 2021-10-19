import { MongoClient } from 'mongodb';
import ProfilePicsData from './ProfilePicsData';
import UsersData from './UsersData';
import mockDb from '../__tests__/__mocks__/database/mockDb';
import handleDatabaseError from './DatabaseErrorHandler';
import config from '../config';
import CreatorsData from './CreatorsData';

const { uri, dbName } = config.database;
const client = new MongoClient(uri);

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

const getDbDependency = process.env.NODE_ENV === 'test' ? mockDb : getDb; // NODE_ENV variable is set to 'test' by Jest

export const usersData = new UsersData(getDbDependency, handleDatabaseError);
export const profilePicsData = new ProfilePicsData(getDbDependency, handleDatabaseError);
export const creatorsData = new CreatorsData(getDbDependency, handleDatabaseError);
