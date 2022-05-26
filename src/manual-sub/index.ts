/* eslint-disable import/prefer-default-export */
import { findCreator } from '../creator';
import { manualSubsData } from '../database';
import squadValidator from '../squad/validator';
import AddManualSub from './AddManualSub';
import CountManualSubs from './CountManualSubs';
import FindManualSub from './FindManualSub';
import FindManualSubbedCreators from './FindManualSubbedCreators';
import manualSubValidator from './validator';

export const addManualSub = new AddManualSub(manualSubsData, manualSubValidator, squadValidator);
export const findManualSub = new FindManualSub(manualSubsData, manualSubValidator);
export const countManualSub = new CountManualSubs(manualSubsData);
export const findManualSubbedCreators = new FindManualSubbedCreators(findManualSub, findCreator, manualSubsData);
