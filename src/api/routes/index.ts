import creatorRoutes from './creator.routes';
import userRoutes from './user.routes';
import squadRoutes from './squad.routes';
import goalRoutes from './goal.routes';

export default [
  ...userRoutes,
  ...creatorRoutes,
  ...squadRoutes,
  ...goalRoutes,
];
