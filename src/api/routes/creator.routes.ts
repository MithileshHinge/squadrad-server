import CreatorController from '../controllers/CreatorController';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/creator',
    post: [authorizationMiddleware, CreatorController.postCreator],
    patch: [authorizationMiddleware, CreatorController.patchCreator],
    get: [authorizationMiddleware, CreatorController.getCreator],
  },
  {
    path: '/creator/:userId',
    get: [CreatorController.getCreatorUserId],
  },
];
