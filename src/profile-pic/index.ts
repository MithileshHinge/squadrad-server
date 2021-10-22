import { profilePicsData } from '../database';
import GetProfilePic from './GetProfilePic';
import SetProfilePic from './SetProfilePic';
import profilePicValidator from './validator';

export const setProfilePic = new SetProfilePic(profilePicsData, profilePicValidator);
export const getProfilePic = new GetProfilePic(profilePicsData);
