import CreatorController from '../controllers/CreatorController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { processMultipartImage } from '../services/multer.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/creator',
    post: [authorizationMiddleware, CreatorController.postCreator],
    patch: [authorizationMiddleware, creatorAuthorizationMiddleware, CreatorController.patchCreator],
    get: [authorizationMiddleware, CreatorController.getCreator],
  },
  {
    path: '/creator/profile-pic',
    put: [authorizationMiddleware, creatorAuthorizationMiddleware, processMultipartImage(1000000, 1, 'profilePic'), CreatorController.putProfilePic],
  },
  {
    path: '/creator/:userId',
    get: [CreatorController.getCreatorUserId],
  },
];
