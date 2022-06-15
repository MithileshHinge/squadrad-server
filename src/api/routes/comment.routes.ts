import CommentController from '../controllers/CommentController';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/comment/post/:postId',
    post: [authorizationMiddleware, CommentController.postComment],
  },
  {
    path: '/comments/post/:postId',
    get: [authorizationMiddleware, CommentController.getCommentsOnPost],
  },
  {
    path: '/comments/count/post/:postId',
    get: [CommentController.getNumCommentsOnPost],
  },
  {
    path: '/comment/:commentId',
    get: [authorizationMiddleware, CommentController.getCommentById],
    delete: [authorizationMiddleware, CommentController.deleteComment],
  },
];
