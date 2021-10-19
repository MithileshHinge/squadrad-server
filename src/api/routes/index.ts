import creatorRoutes from './creator.routes';
import userRoutes from './user.routes';

export default [
  ...userRoutes,
  ...creatorRoutes,
];
