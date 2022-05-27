export default interface IMessagesData {
  /**
   * Insert new message
   * @returns added message
   */
  insertNewMessage({
    messageId, senderUserId, receiverUserId, text, isSenderCreator, timestamp,
  }: {
    messageId: string,
    senderUserId: string,
    receiverUserId: string,
    text: string,
    isSenderCreator: boolean,
    timestamp: number,
  }): Promise<{
    messageId: string,
    senderUserId: string,
    receiverUserId: string,
    text: string,
    isSenderCreator: boolean,
    timestamp: number,
  }>

  /**
   * Fetch all messages between userId and creatorId
   * @return array of messages
   */
  fetchMessagesByUserIds({ userId, creatorUserId }: {
    userId: string,
    creatorUserId: string,
  }): Promise<{
    messageId: string,
    senderUserId: string,
    receiverUserId: string,
    text: string,
    isSenderCreator: boolean,
    timestamp: number,
  }[]>

  /**
   * Fetch last message between this user and any other user
   */
  fetchLastMessages({ userId, isFromCreatorInbox }: {
    userId: string,
    isFromCreatorInbox: boolean,
  }): Promise<{
    messageId: string,
    senderUserId: string,
    receiverUserId: string,
    text: string,
    isSenderCreator: boolean,
    timestamp: number,
  }[]>
}
