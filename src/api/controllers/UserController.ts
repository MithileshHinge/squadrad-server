import ValidationError from '../../common/errors/ValidationError';
import { addUser } from '../../user';
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
    console.log(err);
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
};
