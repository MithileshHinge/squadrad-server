import ValidationError from '../../common/errors/ValidationError';
import fileValidator from '../../common/validators/fileValidator';
import config from '../../config';
import { addPost, findPost } from '../../post';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postPost: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const {
      description, squadId, link,
    } = httpRequest.body;
    const { type } = httpRequest.params;
    const src = httpRequest.files ? httpRequest.files[0] : undefined;

    const postAdded = await addPost.add({
      userId, description, squadId, link, type, src,
    });
    return {
      statusCode: HTTPResponseCode.OK,
      body: postAdded,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getPostsByCreatorUserId: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const { creatorUserId } = httpRequest.params;

    const posts = await findPost.findPostsByUserId({ userId, creatorUserId });

    return {
      statusCode: HTTPResponseCode.OK,
      body: posts,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getPostById: IBaseController = async (httpRequest) => {
  try {
    const { userId } = httpRequest;
    const { postId } = httpRequest.params;
    const post = await findPost.findPostById({ userId, postId });

    return {
      statusCode: HTTPResponseCode.OK,
      body: post,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

const getPostAttachmentFile: IBaseController = async (httpRequest) => {
  try {
    const { attachmentId } = httpRequest.params;
    if (!fileValidator.fileExists(`${config.postAttachmentsDir}/${attachmentId}`)) throw new ValidationError('Post attachment file does not exist');
    return {
      file: `${config.postAttachmentsDir}/${attachmentId}`,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  postPost,
  getPostsByCreatorUserId,
  getPostAttachmentFile,
  getPostById,
};
