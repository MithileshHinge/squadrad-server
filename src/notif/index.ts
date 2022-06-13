/* eslint-disable import/prefer-default-export */
import { notifsData } from '../database';
import { findManualSubbedUsers } from '../manual-sub';
import AddNotif from './AddNotif';

export const addNotif = new AddNotif(findManualSubbedUsers, notifsData);
