import PostLikeController from '../controllers/PostLikeController';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/like/:postId',
    post: [authorizationMiddleware, PostLikeController.postPostLike],
    get: [authorizationMiddleware, PostLikeController.getPostLike],
  },
  {
    path: '/likes/:postId',
    get: [PostLikeController.getTotalPostLikes],
  },
];
