import FindAttachment from './FindAttachment';
import MakeAttachment from './MakeAttachment';
import attachmentValidator from './validator';

export const makeAttachment = new MakeAttachment(attachmentValidator);
export const findAttachment = new FindAttachment(attachmentValidator);
