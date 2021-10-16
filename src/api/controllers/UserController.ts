import AuthenticationError from '../../common/errors/AuthenticationError';
import JWTError from '../../common/errors/JWTError';
import ValidationError from '../../common/errors/ValidationError';
import {
  addUser, changePassword, editUser, findUser, verifyEmail,
} from '../../user';
import { HTTPResponseCode } from '../HttpResponse';
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
    switch (err.constructor) {
      case ValidationError:
        return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
        break;
      default:
        return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
        break;
    }
  }
};

const patchUserVerify: IBaseController = async (httpRequest) => {
  try {
    const { token } = httpRequest.body;
    await verifyEmail.verify(token);
    return {
      statusCode: HTTPResponseCode.OK,
      body: {},
    };
  } catch (err: any) {
    switch (err.constructor) {
      case ValidationError:
        return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
        break;
      case JWTError:
        if (err.message === 'Token expired') return { statusCode: HTTPResponseCode.FORBIDDEN, body: {} };
        return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
        break;
      default:
        return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
        break;
    }
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
    return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
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
    switch (err.constructor) {
      case ValidationError:
        return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
        break;
      default:
        return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
        break;
    }
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
    switch (err.constructor) {
      case ValidationError:
        return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
        break;
      case AuthenticationError:
        return { statusCode: HTTPResponseCode.UNAUTHORIZED, body: {} };
        break;
      default:
        return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
        break;
    }
  }
};

export default {
  postUser,
  patchUserVerify,
  getUserSelf,
  patchUser,
  patchUserPassword,
};
