import { postLikesData } from '../database';
import CheckPostLike from './CheckPostLike';
import CountPostLikes from './CountPostLikes';
import TogglePostLike from './TogglePostLike';

export const checkPostLike = new CheckPostLike(postLikesData);
export const togglePostLike = new TogglePostLike(checkPostLike, postLikesData);
export const countPostLikes = new CountPostLikes(postLikesData);
