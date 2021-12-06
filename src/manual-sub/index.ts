/* eslint-disable import/prefer-default-export */
import { manualSubsData } from '../database';
import squadValidator from '../squad/validator';
import AddManualSub from './AddManualSub';
import FindManualSub from './FindManualSub';
import manualSubValidator from './validator';

export const addManualSub = new AddManualSub(manualSubsData, manualSubValidator, squadValidator);
export const findManualSub = new FindManualSub(manualSubsData, manualSubValidator);
