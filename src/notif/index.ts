/* eslint-disable import/prefer-default-export */
import { notifsData } from '../database';
import { findManualSubbedUsers } from '../manual-sub';
import AddNotif from './AddNotif';
import FindNotif from './FindNotif';

export const addNotif = new AddNotif(findManualSubbedUsers, notifsData);
export const findNotif = new FindNotif(notifsData);