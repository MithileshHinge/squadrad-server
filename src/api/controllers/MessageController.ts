import { findCreator } from '../../creator';
import { addMessage, findMessage } from '../../message';
import { findUser } from '../../user';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postMessage: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const receiverUserId = httpRequest.params.userId;
    const isSenderCreator = httpRequest.path.includes('creator');
    const { text } = httpRequest.body;

    const addedMessage = await addMessage.add({
      senderUserId: userId, receiverUserId, text, isSenderCreator,
    });

    return {
      statusCode: HTTPResponseCode.OK,
      body: addedMessage,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getMessagesByUserId: IBaseController = async (httpRequest) => {
  try {
    const fromCreatorInbox = httpRequest.path.includes('creator');
    const creatorUserId = fromCreatorInbox ? httpRequest.userId! : httpRequest.params.userId;
    const userId = fromCreatorInbox ? httpRequest.params.userId : httpRequest.userId!;

    const messages = await findMessage.findMessagesByUserIds({ userId, creatorUserId });

    return {
      statusCode: HTTPResponseCode.OK,
      body: messages,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getMessageRooms: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const isFromCreatorInbox = httpRequest.path.includes('creator');
    const lastMessages = await findMessage.findLastMessages({ userId, isFromCreatorInbox });

    let rooms: any[] = [];
    const userIds = lastMessages.map((m) => (m.isSenderCreator === isFromCreatorInbox ? m.receiverUserId : m.senderUserId));
    let userInfos: { userId: string, name: string, profilePicSrc: string }[];
    if (isFromCreatorInbox) {
      const users = await findUser.findUserInfos({ userIds, onlyVerified: true });
      userInfos = users.map((u) => ({
        userId: u.userId,
        name: u.fullName,
        profilePicSrc: u.profilePicSrc,
      }));
    } else {
      const creators = await findCreator.findCreatorInfos(userIds);
      userInfos = creators.map((c) => ({
        userId: c.userId,
        name: c.pageName,
        profilePicSrc: c.profilePicSrc,
      }));
    }

    rooms = userInfos.map((user) => {
      const lastMessage = lastMessages.find((m) => m.senderUserId === user.userId || m.receiverUserId === user.userId)!;
      return {
        userId: lastMessage.senderUserId === userId ? lastMessage.receiverUserId : lastMessage.senderUserId,
        name: user.name,
        profilePicSrc: user.profilePicSrc,
        lastMessage,
      };
    });
    return {
      statusCode: HTTPResponseCode.OK,
      body: rooms,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postMessage,
  getMessagesByUserId,
  getMessageRooms,
};
