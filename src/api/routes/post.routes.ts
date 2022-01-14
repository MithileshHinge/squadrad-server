import config from '../../config';
import PostController from '../controllers/PostController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import processMultipartImage from '../services/multer.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/post',
    post: [authorizationMiddleware, creatorAuthorizationMiddleware, processMultipartImage(20000000, 1, 'postImage'), PostController.postPost],
  },
  {
    path: '/posts/:creatorUserId',
    get: [authorizationMiddleware, PostController.getPostsByCreatorUserId],
  },
  {
    path: `/${config.postAttachmentsDir}/:attachmentId`,
    get: [PostController.getPostAttachmentFile],
  },
];
