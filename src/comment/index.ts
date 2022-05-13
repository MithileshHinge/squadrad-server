import { commentsData } from '../database';
import { findPost } from '../post';
import AddComment from './AddComment';
import CountComments from './CountComments';
import FindComment from './FindComment';
import commentValidator from './validator';

export const addComment = new AddComment(findPost, commentsData, commentValidator);
export const findComment = new FindComment(findPost, commentsData);
export const countComments = new CountComments(commentsData);
