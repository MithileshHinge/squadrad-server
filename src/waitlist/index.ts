/* eslint-disable import/prefer-default-export */
import { waitlistData } from '../database';
import JoinWaitlist from './JoinWaitlist';
import waitlistValidator from './validator';

export const joinWaitlist = new JoinWaitlist(waitlistData, waitlistValidator);
