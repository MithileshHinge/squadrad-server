import UserController from './controllers/UserController';

export default [
  {
    path: '/user',
    post: UserController.postUser, // register new user
    patch: UserController.patchUser, // change user details
  },
  {
    path: '/user/verify',
    patch: UserController.patchUserVerify, // verify user's email address
  },
];
