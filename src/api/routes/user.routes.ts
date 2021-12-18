import UserController from '../controllers/UserController';
import processMultipartImage from '../services/multer.service';
import { authorizationMiddleware } from '../services/passport.service';

export default [
  {
    path: '/user',
    post: [UserController.postUser], // register new user
    get: [authorizationMiddleware, UserController.getUserSelf], // get self info
    patch: [authorizationMiddleware, UserController.patchUser], // change user details
  },
  {
    path: '/user/verify',
    patch: [UserController.patchUserVerify], // verify user's email address
  },
  {
    path: '/user/password',
    patch: [authorizationMiddleware, UserController.patchUserPassword],
  },
  {
    path: '/user/profile-pic',
    put: [authorizationMiddleware, processMultipartImage(1000000, 1, 'profilePic'), UserController.putProfilePic],
  },
];
