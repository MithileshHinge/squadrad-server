import creatorRoutes from './creator.routes';
import userRoutes from './user.routes';
import squadRoutes from './squad.routes';
import goalRoutes from './goal.routes';
import paymentRoutes from './payment.routes';
import postRoutes from './post.routes';
import postLikeRoutes from './postLike.routes';

export default [
  ...userRoutes,
  ...creatorRoutes,
  ...squadRoutes,
  ...goalRoutes,
  ...paymentRoutes,
  ...postRoutes,
  ...postLikeRoutes,
];
