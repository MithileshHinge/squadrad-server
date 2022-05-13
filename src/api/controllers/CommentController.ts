import { addComment, countComments, findComment } from '../../comment';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postComment: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { postId } = httpRequest.params;
    const { text, replyToCommentId } = httpRequest.body;

    const commentAdded = await addComment.add({
      userId, postId, text, replyToCommentId,
    });

    return {
      statusCode: HTTPResponseCode.OK,
      body: commentAdded,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getCommentsOnPost: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { postId } = httpRequest.params;

    const comments = await findComment.findCommentsByPostId({ userId, postId });

    return {
      statusCode: HTTPResponseCode.OK,
      body: comments,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getNumCommentsOnPost: IBaseController = async (httpRequest) => {
  try {
    const { postId } = httpRequest.params;
    const count = await countComments.count(postId);

    return {
      statusCode: HTTPResponseCode.OK,
      body: count,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postComment,
  getCommentsOnPost,
  getNumCommentsOnPost,
};
