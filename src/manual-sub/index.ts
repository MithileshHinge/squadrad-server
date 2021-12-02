/* eslint-disable import/prefer-default-export */
import { manualSubsData } from '../database';
import { findSquad } from '../squad';
import AddManualSub from './AddManualSub';

export const addManualSub = new AddManualSub(manualSubsData, findSquad);
