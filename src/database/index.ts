import ProfilePicsData from './ProfilePicsData';
import UsersData from './UsersData';
import handleDatabaseError from './DatabaseErrorHandler';
import CreatorsData from './CreatorsData';
import getDb from './getDb';
import SquadsData from './SquadsData';
import GoalsData from './GoalsData';
import ManualSubsData from './ManualSubsData';
import PostsData from './PostsData';
import PostLikesData from './PostLikesData';
import CommentsData from './CommentsData';
import MessagesData from './MessagesData';
import PaymentsData from './PaymentsData';
import NotifsData from './NotifsData';
import WaitlistData from './WaitlistData';

export const usersData = new UsersData(getDb, handleDatabaseError);
export const profilePicsData = new ProfilePicsData(getDb, handleDatabaseError);
export const creatorsData = new CreatorsData(getDb, handleDatabaseError);
export const squadsData = new SquadsData(getDb, handleDatabaseError);
export const goalsData = new GoalsData(getDb, handleDatabaseError);
export const manualSubsData = new ManualSubsData(getDb, handleDatabaseError);
export const postsData = new PostsData(getDb, handleDatabaseError);
export const postLikesData = new PostLikesData(getDb, handleDatabaseError);
export const commentsData = new CommentsData(getDb, handleDatabaseError);
export const messagesData = new MessagesData(getDb, handleDatabaseError);
export const paymentsData = new PaymentsData(getDb, handleDatabaseError);
export const notifsData = new NotifsData(getDb, handleDatabaseError);
export const waitlistData = new WaitlistData(getDb, handleDatabaseError);
