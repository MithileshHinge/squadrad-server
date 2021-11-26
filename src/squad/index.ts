import { squadsData } from '../database';
import AddSquad from './AddSquad';
import EditSquad from './EditSquad';
import FindSquad from './FindSquad';
import squadValidator from './validator';

export const addSquad = new AddSquad(squadsData, squadValidator);
export const editSquad = new EditSquad(squadsData, squadValidator);
export const findSquad = new FindSquad(squadsData);
