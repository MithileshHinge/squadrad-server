/* eslint-disable import/prefer-default-export */
import { postsData } from '../database';
import AddPost from './AddPost';
import postValidator from './validator';

export const addPost = new AddPost(postsData, postValidator);
