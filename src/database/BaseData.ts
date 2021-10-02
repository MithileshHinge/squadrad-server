import { Db } from 'mongodb';

export default class BaseData {
  getDb: () => Promise<Db>;

  handleDatabaseError: (err: any, message: string) => never;

  constructor(getDb: () => Promise<Db>, handleDatabaseError: (err: any, message: string) => never) {
    this.getDb = getDb;
    this.handleDatabaseError = handleDatabaseError;
  }
}
