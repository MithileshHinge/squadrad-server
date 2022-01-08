/* eslint-disable import/prefer-default-export */
import MakeAttachment from './MakeAttachment';
import attachmentValidator from './validator';

export const makeAttachment = new MakeAttachment(attachmentValidator);
