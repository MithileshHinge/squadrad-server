import { goalsData } from '../database';
import AddGoal from './AddGoal';
import EditGoal from './EditGoal';
import FindGoal from './FindGoal';
import goalValidator from './validator';

export const addGoal = new AddGoal(goalsData, goalValidator);
export const editGoal = new EditGoal(goalsData, goalValidator);
export const findGoal = new FindGoal(goalsData);
