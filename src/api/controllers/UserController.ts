import JWTError from '../../common/errors/JWTError';
import ValidationError from '../../common/errors/ValidationError';
import { addUser, editUser, verifyEmail } from '../../user';
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
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        statusCode: HTTPResponseCode.BAD_REQUEST,
        body: {},
      };
    }
    return {
      statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR,
      body: {},
    };
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
    if (err instanceof ValidationError || (err instanceof JWTError && err.message !== 'Token expired')) {
      return {
        statusCode: HTTPResponseCode.BAD_REQUEST,
        body: {},
      };
    }
    if (err instanceof JWTError) {
      return {
        statusCode: HTTPResponseCode.FORBIDDEN,
        body: {},
      };
    }
    return {
      statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR,
      body: {},
    };
  }
};

const patchUser: IBaseController = async (httpRequest) => {
  try {
    const { userId } = httpRequest.user;
    const { fullName } = httpRequest.body;
    await editUser.edit({ userId, fullName });
    return {
      statusCode: HTTPResponseCode.OK,
      body: {},
    };
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return {
        statusCode: HTTPResponseCode.BAD_REQUEST,
        body: {},
      };
    }
    return {
      statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR,
      body: {},
    };
  }
};

export default {
  postUser,
  patchUserVerify,
  patchUser,
};
