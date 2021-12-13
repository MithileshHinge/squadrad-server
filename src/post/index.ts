/* eslint-disable import/prefer-default-export */
import { postsData } from '../database';
import { findSquad } from '../squad';
import AddPost from './AddPost';
import postValidator from './validator';

export const addPost = new AddPost(findSquad, postsData, postValidator);
