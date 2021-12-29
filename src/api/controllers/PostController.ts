import { addPost, findPost } from '../../post';
import { PostAttachmentType } from '../../post/IPostAttachment';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const postPost: IBaseController = async (httpRequest) => {
  try {
    const userId = httpRequest.userId!;
    const {
      description, squadId, type, link,
    } = httpRequest.body;

    let attachments: any[] = [];
    if (type === PostAttachmentType.IMAGE) {
      const src: any = httpRequest.files ? httpRequest.files[0] : undefined;
      attachments = [{ type, src }];
    } else if (type === PostAttachmentType.LINK) {
      attachments = [{ type, src: link }];
    }

    const postAdded = await addPost.add({
      userId, description, squadId, attachments,
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

export default {
  postPost,
  getPostsByCreatorUserId,
};
