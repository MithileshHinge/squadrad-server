import PostController from '../controllers/PostController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/post',
    post: [authorizationMiddleware, creatorAuthorizationMiddleware, PostController.postPost],
  },
  {
    path: '/posts/:creatorUserId',
    get: [authorizationMiddleware, PostController.getPostsByCreatorUserId],
  },
];
