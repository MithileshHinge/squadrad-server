import SquadController from '../controllers/SquadController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/squad',
    post: [authorizationMiddleware, creatorAuthorizationMiddleware, SquadController.postSquad],
  },
  {
    path: '/squad/:squadId',
    patch: [authorizationMiddleware, creatorAuthorizationMiddleware, SquadController.patchSquad],
  },
];
