import { postLikesData } from '../database';
import { addNotif } from '../notif';
import CheckPostLike from './CheckPostLike';
import CountPostLikes from './CountPostLikes';
import RemovePostLike from './RemovePostLike';
import TogglePostLike from './TogglePostLike';

export const checkPostLike = new CheckPostLike(postLikesData);
export const togglePostLike = new TogglePostLike(checkPostLike, addNotif, postLikesData);
export const countPostLikes = new CountPostLikes(postLikesData);
export const removePostLike = new RemovePostLike(postLikesData);
