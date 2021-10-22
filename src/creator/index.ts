import { creatorsData, usersData } from '../database';
import { setProfilePic } from '../profile-pic';
import BecomeCreator from './BecomeCreator';
import EditCreator from './EditCreator';
import creatorValidator from './validator';

export const becomeCreator = new BecomeCreator(usersData, creatorsData, creatorValidator, setProfilePic);
export const editCreator = new EditCreator(creatorsData, creatorValidator);
