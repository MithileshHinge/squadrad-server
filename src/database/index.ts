import ProfilePicsData from './ProfilePicsData';
import UsersData from './UsersData';
import handleDatabaseError from './DatabaseErrorHandler';
import CreatorsData from './CreatorsData';
import getDb from './getDb';

export const usersData = new UsersData(getDb, handleDatabaseError);
export const profilePicsData = new ProfilePicsData(getDb, handleDatabaseError);
export const creatorsData = new CreatorsData(getDb, handleDatabaseError);
