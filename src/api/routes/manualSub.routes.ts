import ManualSubController from '../controllers/ManualSubController';
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
];
