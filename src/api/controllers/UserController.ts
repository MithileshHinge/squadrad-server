import {
  addUser, changePassword, editUser, findUser, verifyEmail,
} from '../../user';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postUser: IBaseController = async (httpRequest) => {
  try {
    const { fullName, email, password } = httpRequest.body;
    await addUser.add({ fullName, email, password });
    return {
      statusCode: HTTPResponseCode.CREATED,
      body: {},
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getUserVerify: IBaseController = async (httpRequest) => {
  try {
    const { token } = httpRequest.query;
    await verifyEmail.verify(token);
    return {
      statusCode: HTTPResponseCode.OK,
      body: {},
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getUserSelf: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const user = await findUser.findUserById(userId, true);
    if (!user) return { statusCode: HTTPResponseCode.NOT_FOUND, body: {} };

    return {
      statusCode: HTTPResponseCode.OK,
      body: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        profilePicSrc: user.profilePicSrc,
      },
    };
  } catch (err:any) {
    return handleControllerError(err);
  }
};

const patchUser: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { fullName } = httpRequest.body;
    await editUser.edit({ userId, fullName });
    return {
      statusCode: HTTPResponseCode.OK,
      body: {},
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const patchUserPassword: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { oldPassword, newPassword } = httpRequest.body;
    await changePassword.change(userId, oldPassword, newPassword);
    return {
      statusCode: HTTPResponseCode.OK,
      body: {},
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postUser,
  getUserVerify,
  getUserSelf,
  patchUser,
  patchUserPassword,
};
