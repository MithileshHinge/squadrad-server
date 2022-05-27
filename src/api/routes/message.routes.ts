import MessageController from '../controllers/MessageController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/messages/rooms',
    get: [authorizationMiddleware, MessageController.getMessageRooms],
  },
  {
    path: '/messages/creator/rooms',
    get: [authorizationMiddleware, MessageController.getMessageRooms],
  },
  {
    path: '/messages/:userId',
    post: [authorizationMiddleware, MessageController.postMessage],
    get: [authorizationMiddleware, MessageController.getMessagesByUserId],
  },
  {
    path: '/messages/creator/:userId',
    post: [authorizationMiddleware, creatorAuthorizationMiddleware, MessageController.postMessage],
    get: [authorizationMiddleware, creatorAuthorizationMiddleware, MessageController.getMessagesByUserId],
  },
];
