import RemoveComment from '../comment/RemoveComment';
import { commentsData, postsData } from '../database';
import { findManualSub } from '../manual-sub';
import { deleteAttachmentFile, findAttachment, makeAttachment } from '../post-attachment';
import { removePostLike } from '../post-like';
import { findSquad } from '../squad';
import AddPost from './AddPost';
import RemovePost from './RemovePost';
import FindPost from './FindPost';
import postValidator from './validator';
import EditPost from './EditPost';
import commentValidator from '../comment/validator';

export const addPost = new AddPost(findSquad, makeAttachment, postsData, postValidator);
export const findPost = new FindPost(findSquad, findManualSub, findAttachment, postsData, postValidator);
export const editPost = new EditPost(findPost, postsData, postValidator);
const removeComment = new RemoveComment(findPost, commentsData, commentValidator);
export const removePost = new RemovePost(removePostLike, removeComment, deleteAttachmentFile, postsData, postValidator);
