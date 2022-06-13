import ManualSubController from '../controllers/ManualSubController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/manualSub/:creatorUserId',
    get: [authorizationMiddleware, ManualSubController.getManualSubByCreatorId],
  },
  {
    path: '/manualSubs',
    get: [authorizationMiddleware, ManualSubController.getAllManualSubs],
  },
  {
    path: '/manualSubs/active/creators',
    get: [authorizationMiddleware, ManualSubController.getAllManualSubbedCreators],
  },
  {
    path: '/manualSubs/active/users',
    get: [authorizationMiddleware, creatorAuthorizationMiddleware, ManualSubController.getAllManualSubbedUsers],
  },
  {
    path: '/manualSub/:creatorUserId/cancel',
    patch: [authorizationMiddleware, ManualSubController.patchManualSubCancel],
  },
];
