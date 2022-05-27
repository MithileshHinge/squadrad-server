import { messagesData } from '../database';
import { findManualSub } from '../manual-sub';
import AddMessage from './AddMessage';
import FindMessage from './FindMessage';
import messageValidator from './validator';

export const addMessage = new AddMessage(findManualSub, messagesData, messageValidator);
export const findMessage = new FindMessage(messagesData, messageValidator);
