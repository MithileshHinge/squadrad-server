import ManualSubController from '../controllers/ManualSubController';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/manualSub/:creatorUserId',
    get: [authorizationMiddleware, ManualSubController.getManualSubByCreatorId],
  },
];
