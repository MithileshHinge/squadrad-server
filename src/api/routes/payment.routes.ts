import PaymentController from '../controllers/PaymentController';
import creatorAuthorizationMiddleware from '../services/creatorAuth.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/payment/order/:squadId',
    get: [authorizationMiddleware, PaymentController.getRzpOrder],
  },
  {
    path: '/payment/success',
    post: [authorizationMiddleware, PaymentController.postPaymentSuccess],
  },
  {
    path: '/payments',
    get: [authorizationMiddleware, creatorAuthorizationMiddleware, PaymentController.getPaymentsToCreator],
  },
];
