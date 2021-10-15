import UserController from './controllers/UserController';

export default [
  {
    path: '/user',
    post: UserController.postUser, // register new user
    get: UserController.getUserSelf, // get self info
    patch: UserController.patchUser, // change user details
  },
  {
    path: '/user/verify',
    patch: UserController.patchUserVerify, // verify user's email address
  },
  {
    path: '/user/password',
    patch: UserController.patchUserPassword,
  },
];
