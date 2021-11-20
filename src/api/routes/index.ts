import creatorRoutes from './creator.routes';
import userRoutes from './user.routes';
import squadRoutes from './squad.routes';

export default [
  ...userRoutes,
  ...creatorRoutes,
  ...squadRoutes,
];
