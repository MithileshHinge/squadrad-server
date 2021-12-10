import ProfilePicsData from './ProfilePicsData';
import UsersData from './UsersData';
import handleDatabaseError from './DatabaseErrorHandler';
import CreatorsData from './CreatorsData';
import getDb from './getDb';
import SquadsData from './SquadsData';
import GoalsData from './GoalsData';
import ManualSubsData from './ManualSubsData';
import PostsData from './PostsData';

export const usersData = new UsersData(getDb, handleDatabaseError);
export const profilePicsData = new ProfilePicsData(getDb, handleDatabaseError);
export const creatorsData = new CreatorsData(getDb, handleDatabaseError);
export const squadsData = new SquadsData(getDb, handleDatabaseError);
export const goalsData = new GoalsData(getDb, handleDatabaseError);
export const manualSubsData = new ManualSubsData(getDb, handleDatabaseError);
export const postsData = new PostsData(getDb, handleDatabaseError);
