import { postsData } from '../database';
import { findManualSub } from '../manual-sub';
import { findSquad } from '../squad';
import AddPost from './AddPost';
import FindPost from './FindPost';
import postValidator from './validator';

export const addPost = new AddPost(findSquad, postsData, postValidator);
export const findPost = new FindPost(findSquad, findManualSub, postsData);
