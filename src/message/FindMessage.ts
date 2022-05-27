import { validateUserId } from '../userId';
import IMessagesData from './IMessagesData';
import IMessageValidator from './validator/IMessageValidator';

export default class FindMessage {
  private messagesData: IMessagesData;

  private messageValidator: IMessageValidator;

  constructor(messagesData: IMessagesData, messageValidator: IMessageValidator) {
    this.messagesData = messagesData;
    this.messageValidator = messageValidator;
  }

  /**
   * Find all messages between a user and a creator
   * @param userId userId of supporter
   * @param creatorUserId userId of creator
   */
  async findMessagesByUserIds({ userId, creatorUserId }: {
    userId: string,
    creatorUserId: string,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const creatorUserIdValidated = validateUserId.validate(creatorUserId);

    const messages = await this.messagesData.fetchMessagesByUserIds({ userId: userIdValidated, creatorUserId: creatorUserIdValidated });

    return messages.map((message) => ({
      messageId: message.messageId,
      senderUserId: message.senderUserId,
      receiverUserId: message.receiverUserId,
      text: message.text,
      isSenderCreator: message.isSenderCreator,
      timestamp: message.timestamp,
    }));
  }

  /**
   * Find all last messages (sent or received) of user
   * @param userId Id of user requesting last messages
   * @param isFromCreatorInbox True if request is from creator inbox, false if from user inbox
   */
  async findLastMessages({ userId, isFromCreatorInbox }: {
    userId: string,
    isFromCreatorInbox: boolean,
  }) {
    const userIdValidated = validateUserId.validate(userId);
    const isFromCreatorInboxValidated = this.messageValidator.validateIsSenderCreator(isFromCreatorInbox); // different variable but same function so its okay

    const lastMessages = await this.messagesData.fetchLastMessages({ userId: userIdValidated, isFromCreatorInbox: isFromCreatorInboxValidated });

    return lastMessages.map((message) => ({
      messageId: message.messageId,
      senderUserId: message.senderUserId,
      receiverUserId: message.receiverUserId,
      text: message.text,
      isSenderCreator: message.isSenderCreator,
      timestamp: message.timestamp,
    }));
  }
}
