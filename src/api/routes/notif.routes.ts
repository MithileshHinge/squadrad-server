import NotifController from '../controllers/NotifController';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/notifs',
    get: [authorizationMiddleware, NotifController.getNotifs],
  },
  {
    path: '/notifs/unseen/check',
    get: [authorizationMiddleware, NotifController.getIsUnseenNotifs],
  },
];
