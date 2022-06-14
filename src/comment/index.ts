import { commentsData } from '../database';
import { addNotif } from '../notif';
import { findPost } from '../post';
import AddComment from './AddComment';
import CountComments from './CountComments';
import FindComment from './FindComment';
import RemoveComment from './RemoveComment';
import commentValidator from './validator';

export const addComment = new AddComment(findPost, addNotif, commentsData, commentValidator);
export const findComment = new FindComment(findPost, commentsData);
export const countComments = new CountComments(commentsData);
export const removeComment = new RemoveComment(findPost, commentsData, commentValidator);
