import CommentController from '../controllers/CommentController';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/comment/:postId',
    post: [authorizationMiddleware, CommentController.postComment],
  },
  {
    path: '/comments/:postId',
    get: [authorizationMiddleware, CommentController.getCommentsOnPost],
  },
];
