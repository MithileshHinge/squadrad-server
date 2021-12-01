import GoalController from '../controllers/GoalController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/goal',
    post: [authorizationMiddleware, creatorAuthorizationMiddleware, GoalController.postGoal],
  },
  {
    path: '/creator/:userId/goals',
    get: [GoalController.getAllGoalsByUserId],
  },
  {
    path: '/goal/:goalId',
    patch: [authorizationMiddleware, creatorAuthorizationMiddleware, GoalController.patchGoal],
  },
];
