import UserController from './controllers/UserController';

export default [
  {
    path: '/user',
    post: UserController.postUser, // register new user
  },
  {
    path: '/user/verify',
    patch: UserController.patchUserVerify, // verify user's email address
  },
];
