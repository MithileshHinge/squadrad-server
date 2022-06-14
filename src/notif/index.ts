/* eslint-disable import/prefer-default-export */
import FindComment from '../comment/FindComment';
import { commentsData, notifsData, postsData } from '../database';
import { findManualSub, findManualSubbedUsers } from '../manual-sub';
import { findAttachment } from '../post-attachment';
import FindPost from '../post/FindPost';
import postValidator from '../post/validator';
import { findSquad } from '../squad';
import AddNotif from './AddNotif';
import FindNotif from './FindNotif';

const findPost = new FindPost(findSquad, findManualSub, findAttachment, postsData, postValidator);
const findComment = new FindComment(findPost, commentsData);
export const addNotif = new AddNotif(findManualSubbedUsers, findPost, findComment, notifsData);
export const findNotif = new FindNotif(notifsData);
