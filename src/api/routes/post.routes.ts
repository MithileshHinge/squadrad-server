import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import { PostAttachmentType } from '../../post-attachment/IPostAttachment';
import PostController from '../controllers/PostController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { processMultipartImage, processMultipartNone, processMultipartVideo } from '../services/multer.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/post/:type?',
    post: [authorizationMiddleware, creatorAuthorizationMiddleware, (req: Request, res: Response, next: NextFunction) => {
      if (req.params.type === PostAttachmentType.IMAGE) {
        const multerImageMiddleware = processMultipartImage(20000000, 1, 'postImage');
        return multerImageMiddleware(req, res, next);
      }
      if (req.params.type === PostAttachmentType.VIDEO) {
        const multerVideoMiddleware = processMultipartVideo(200000000, 1, 'postVideo');
        return multerVideoMiddleware(req, res, next);
      }
      const multerNoneMiddleware = processMultipartNone();
      return multerNoneMiddleware(req, res, next);
    }, PostController.postPost],
  },
  {
    path: '/posts/:creatorUserId',
    get: [PostController.getPostsByCreatorUserId],
  },
  {
    path: '/post/:postId',
    get: [PostController.getPostById],
    patch: [authorizationMiddleware, creatorAuthorizationMiddleware, PostController.patchPost],
    delete: [authorizationMiddleware, creatorAuthorizationMiddleware, PostController.deletePost],
  },
  {
    path: `/${config.postAttachmentsDir}/:attachmentId`,
    get: [PostController.getPostAttachmentFile],
  },
];
