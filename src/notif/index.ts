/* eslint-disable import/prefer-default-export */
import FindComment from '../comment/FindComment';
import commentValidator from '../comment/validator';
import {
  commentsData,
  manualSubsData,
  notifsData,
  postsData,
} from '../database';
import FindManualSub from '../manual-sub/FindManualSub';
import FindManualSubbedUsers from '../manual-sub/FindManualSubbedUsers';
import manualSubValidator from '../manual-sub/validator';
import { findAttachment } from '../post-attachment';
import FindPost from '../post/FindPost';
import postValidator from '../post/validator';
import { findSquad } from '../squad';
import { findUser } from '../user';
import AddNotif from './AddNotif';
import FindNotif from './FindNotif';

const findManualSub = new FindManualSub(manualSubsData, manualSubValidator);
const findManualSubbedUsers = new FindManualSubbedUsers(findManualSub, findUser, manualSubsData);
const findPost = new FindPost(findSquad, findManualSub, findAttachment, postsData, postValidator);
const findComment = new FindComment(findPost, commentsData, commentValidator);
export const addNotif = new AddNotif(findManualSubbedUsers, findPost, findComment, notifsData);
export const findNotif = new FindNotif(notifsData);
