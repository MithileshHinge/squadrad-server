import id from '../common/id';
import FindManualSub from '../manual-sub/FindManualSub';
import ManualSubStatuses from '../manual-sub/ManualSubStatuses';
import { validateUserId } from '../userId';
import IMessagesData from './IMessagesData';
import IMessageValidator from './validator/IMessageValidator';

export default class AddMessage {
  private findManualSub: FindManualSub;

  private messagesData: IMessagesData;

  private messageValidator: IMessageValidator;

  constructor(findManualSub: FindManualSub, messagesData: IMessagesData, messageValidator: IMessageValidator) {
    this.findManualSub = findManualSub;
    this.messagesData = messagesData;
    this.messageValidator = messageValidator;
  }

  /**
   * Add a new message, checks subscription
   * @param senderUserId sender's userId
   * @param receiverUserId receiver's userId
   * @param text message text
   * @param isSenderCreator true if sender is the creator, false if receiver is the creator
   */
  async add({
    senderUserId, receiverUserId, text, isSenderCreator,
  }: {
    senderUserId: string,
    receiverUserId: string,
    text: string,
    isSenderCreator: boolean,
  }) {
    const senderUserIdValidated = validateUserId.validate(senderUserId);
    const receiverUserIdValidated = validateUserId.validate(receiverUserId);
    const textValidated = this.messageValidator.validateText(text);
    const isSenderCreatorValidated = this.messageValidator.validateIsSenderCreator(isSenderCreator);

    let userId = senderUserId;
    let creatorUserId = receiverUserId;
    if (isSenderCreator) {
      userId = receiverUserId;
      creatorUserId = senderUserId;
    }
    const manualSub = await this.findManualSub.findManualSubByUserIds(userId, creatorUserId);

    if (!manualSub || manualSub.subscriptionStatus !== ManualSubStatuses.ACTIVE) {
      return null;
    }

    const messageId = id.createId();
    const timestamp = Date.now();
    const addedMessage = await this.messagesData.insertNewMessage({
      messageId,
      senderUserId: senderUserIdValidated,
      receiverUserId: receiverUserIdValidated,
      text: textValidated,
      isSenderCreator: isSenderCreatorValidated,
      timestamp,
    });

    return {
      messageId: addedMessage.messageId,
      senderUserId: addedMessage.senderUserId,
      receiverUserId: addedMessage.receiverUserId,
      text: addedMessage.text,
      isSenderCreator: addedMessage.isSenderCreator,
      timestamp: addedMessage.timestamp,
    };
  }
}
