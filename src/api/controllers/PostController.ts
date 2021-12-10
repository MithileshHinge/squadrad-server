import { addPost } from '../../post';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postPost: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { title, description } = httpRequest.body;

    const postAdded = await addPost.add({ userId, title, description });
    return {
      statusCode: HTTPResponseCode.OK,
      body: postAdded,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postPost,
};
