import { checkPostLike, togglePostLike } from '../../post-like';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postPostLike: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { postId }: { postId: string } = httpRequest.params;

    const { numLikes } = await togglePostLike.toggle({ userId, postId });

    return {
      statusCode: HTTPResponseCode.OK,
      body: { numLikes },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getPostLike: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { postId }: { postId: string } = httpRequest.params;

    const isPostLiked = await checkPostLike.check({ userId, postId });

    return {
      statusCode: HTTPResponseCode.OK,
      body: { isPostLiked },
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postPostLike,
  getPostLike,
};
